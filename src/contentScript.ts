main()

function download(blob, filename) {
    const a = document.createElement('a')
    a.style.display = 'none'
    document.body.appendChild(a)
    const objectUrl = window.URL.createObjectURL(blob)
    a.href = objectUrl
    a.download = filename
    a.click()
    window.URL.revokeObjectURL(objectUrl)
}

function collectDownloadUrls() {
    const downloadUrls = []

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

async function fetchBlobAndFilename(url) {
    const response = await fetch(url)
    const header = response.headers.get('Content-Disposition')
    const filename = header.split(';')[1].split('=')[1]
    const blob = await response.blob()

    return [blob, filename]
}

async function dispatchClickToAllAllDownloadButtons() {
    const downloadUrls = collectDownloadUrls()

    for (const url of downloadUrls) {
        const [blob, filename] = await fetchBlobAndFilename(url)
        download(blob, filename)
    }
}

function main() {
    const button = document.createElement('button')
    button.innerText = 'このページの写真をすべてダウンロード'
    button.addEventListener('click', dispatchClickToAllAllDownloadButtons)

    const pageHeading = document.querySelector('#downloadList .c-pageTitle')
    pageHeading.after(button)
}
