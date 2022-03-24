main()

function download(blob, filename): void {
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    const objectUrl = window.URL.createObjectURL(blob)
    a.href = objectUrl
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(objectUrl)
}

function collectDownloadUrls(): string[] {
    const downloadUrls: string[] = []

    const iter = document.evaluate(
        '//a[text()="ダウンロードする"]',
        document.getElementById('downloadList'),
        null,
        XPathResult.ANY_TYPE,
        null
    )
    for (
        let anchorElement = iter.iterateNext();
        anchorElement;
        anchorElement = iter.iterateNext()
    ) {
        if (anchorElement instanceof HTMLAnchorElement) {
            downloadUrls.push(anchorElement.href)
        } else {
            console.error('element is not an anchor', anchorElement)
        }
    }

    return downloadUrls
}

async function fetchBlobAndFilename(url): Promise<[Blob, string]> {
    const response = await fetch(url)
    const header = response.headers.get('Content-Disposition')
    const filename = header.split(';')[1].split('=')[1]
    const blob = await response.blob()

    return [blob, filename]
}

function main() {
    const container = document.createElement('div')
    container.style.display = 'flex'
    container.style.flexDirection = 'column'
    container.style.alignItems = 'center'
    container.style.margin = '64px 0'
    container.innerHTML = `
    <button style="width:100%; background:#F2994A; padding:32px; border:none; border-radius:100px; font-size:24px; color:white;">このページの写真をすべてダウンロード</button>
    <div style="display:flex; align-items:center; justify-content: center; gap:8px; padding:16px;"><span style="color:#F2994A">powered by 8122-bulk-downloader</span><img src="${chrome.runtime.getURL(
        'images/icon16.png'
    )}"></div>
    `

    const button = container.getElementsByTagName('button')[0]
    button.innerText = 'このページの写真をすべてダウンロード'
    button.addEventListener('click', async () => {
        const downloadUrls = collectDownloadUrls()
        for (const url of downloadUrls) {
            const [blob, filename] = await fetchBlobAndFilename(url)
            download(blob, filename)
        }
    })

    const pagination = document.querySelector('#downloadList .c-pagination')
    if (pagination) {
        pagination.before(container)
    } else {
        const downloadList = document.getElementById('downloadList')
        const observer = new MutationObserver((mutationList) => {
            const pagination = downloadList.querySelector('.c-pagination')
            if (pagination) {
                pagination.before(container)
                observer.disconnect()
            }
        })
        observer.observe(downloadList, {
            childList: true,
            subtree: true,
        })
    }
}
