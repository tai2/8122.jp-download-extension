main()

function delay(milliseconds) {
    return new Promise((resolve) => {
        setTimeout(resolve, milliseconds)
    })
}

async function dispatchClickToAllAllDownloadButtons() {
    const iter = document.evaluate(
        '//*[text()="ダウンロードする"]',
        document.getElementById('downloadList'),
        null,
        XPathResult.ANY_TYPE,
        null
    )
    for (
        let element = iter.iterateNext();
        element;
        element = iter.iterateNext()
    ) {
        element.click()
        await delay(1000)
    }
}

function main() {
    const button = document.createElement('button')
    button.innerText = 'このページの写真をすべてダウンロード'
    button.addEventListener('click', dispatchClickToAllAllDownloadButtons)

    const pageHeading = document.querySelector('#downloadList .c-pageTitle')
    pageHeading.after(button)
}
