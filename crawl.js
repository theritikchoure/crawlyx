const { JSDOM } = require('jsdom');

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

module.exports = { getURLsFromHTML, normalizeUrl };