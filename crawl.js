const { JSDOM } = require('jsdom');

async function crawlPage(currentUrl) {
    console.log(`currently crawling: ${currentUrl}`);

    try {
        const res = await fetch(currentUrl);
        if(res.status > 399) {
            console.log(`error in fetch with status ${res.status} on page ${currentUrl}`);
            return;
        }

        const contentType = res.headers.get('content-type');
        if(!contentType.includes("text/html")) {
            console.log(`non html response, content-type: ${contentType} on page ${currentUrl}`);
            return;
        }   

        console.log(await res.text())
    } catch (error) {
        console.log(`error in fetch: ${error.message}, on page ${currentUrl}`);   
    }
}

function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        if(linkElement.href.slice(0, 1) === '/') {
            // relative
            try {
                const urlObject = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObject.href);
            } catch (error) {
                console.log(`error with relative url: ${error.message}`);
            }
            
        } else {
            // absolute
            try {
                const urlObject = new URL(linkElement.href);
                urls.push(urlObject.href);
            } catch (error) {
                console.log(`error with absolute url: ${error.message}`);
            }
        }
    }

    return urls;
}

function normalizeUrl(url) {
    const urlObject = new URL(url);
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`;

    if(hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1);
    }

    return hostPath;
}

module.exports = { crawlPage, getURLsFromHTML, normalizeUrl };