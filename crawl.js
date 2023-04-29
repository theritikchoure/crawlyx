const { JSDOM } = require('jsdom');

async function crawlPage(baseUrl, currentUrl, pages) {
    
    const baseUrlObject = new URL(baseUrl);
    const currentUrlObject = new URL(currentUrl);

    if(baseUrlObject.hostname !== currentUrlObject.hostname) {
        return pages;
    }

    const normalizedCurrentUrl = normalizeUrl(currentUrl);

    if(pages[normalizedCurrentUrl] > 0) {
        pages[normalizedCurrentUrl]++;
        return pages;
    }

    pages[normalizedCurrentUrl] = 1;

    console.log(`currently crawling: ${currentUrl}`);

    try {
        const res = await fetch(currentUrl);
        if(res.status > 399) {
            console.log(`error in fetch with status ${res.status} on page ${currentUrl}`);
            return pages;
        }

        const contentType = res.headers.get('content-type');
        if(!contentType.includes("text/html")) {
            console.log(`non html response, content-type: ${contentType} on page ${currentUrl}`);
            return pages;
        }   

        const htmlBody = await res.text();

        const nextUrls = getURLsFromHTML(htmlBody, baseUrl);

        for (const nextUrl of nextUrls) {
            pages = await crawlPage(baseUrl, nextUrl, pages);
        }
    } catch (error) {
        console.log(`error in fetch: ${error.message}, on page ${currentUrl}`);   
    }

    return pages;
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