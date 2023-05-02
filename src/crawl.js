const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');

async function crawlPage(baseUrl, currentUrl, pages) {
    
    const baseUrlObject = new URL(baseUrl);
    const currentUrlObject = new URL(currentUrl);

    if(baseUrlObject.hostname !== currentUrlObject.hostname) {
        return pages;
    }

    const normalizedCurrentUrl = normalizeUrl(currentUrl);

    if(pages[normalizedCurrentUrl]?.occurrence > 0) {
        pages[normalizedCurrentUrl] = {...pages[normalizedCurrentUrl], occurrence: pages[normalizedCurrentUrl]?.occurrence+1}
        return pages;
    }

    // pages[normalizedCurrentUrl] = 1;
    pages[normalizedCurrentUrl] = {
        occurrence: 1
    };

    console.log(`currently crawling: ${currentUrl}`);

    try {
        const res = await fetch(currentUrl);

        pages[normalizedCurrentUrl] = {...pages[normalizedCurrentUrl], statusCode: res.status};

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
        pages[normalizedCurrentUrl] = {...pages[normalizedCurrentUrl], htmlBody};

        const images = getAllImagesFromHtml(htmlBody, baseUrl);
        pages[normalizedCurrentUrl] = {...pages[normalizedCurrentUrl], images};

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

function getAllImagesFromHtml(htmlBody, baseURL) {
    const images = {};
    images.withAltText = [];
    images.withoutAltText = [];
    const dom = new JSDOM(htmlBody);
    const imageElements = dom.window.document.querySelectorAll('img');

    for (const imageElement of imageElements) {
        let imageSrc = '';
        if(imageElement.src.slice(0, 1) === '/') {
            imageSrc = (new URL(`${baseURL}${imageElement.src}`)).href;
        } else {
            imageSrc = (new URL(imageElement.src)).href;
        }

        if(imageElement.alt === '' || imageElement.alt === undefined || imageElement.alt === null) {
            // image without alt text
            try {
                let object = {};
                object.imageSrc = imageSrc;
                object.altText = imageElement.alt;
                images.withoutAltText.push(object);
            } catch (error) {
                console.log(`error with image without alt text: ${error.message}`);
            }
            
        } else {
            // images with alt text
            let object = {};
            object.imageSrc = imageSrc;
            object.altText = imageElement.alt;
            try {
                images.withAltText.push(object);
            } catch (error) {
                console.log(`error with absolute url: ${error.message}`);
            }
        }
    }
    
    return images;
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