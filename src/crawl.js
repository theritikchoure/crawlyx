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

        const onPageSEODetails = geOnPageSEORelatedInfo(htmlBody);
        pages[normalizedCurrentUrl] = { ...pages[normalizedCurrentUrl], onPageSEODetails };

        const nextUrls = getURLsFromHTML(htmlBody, baseUrl);

        for (const nextUrl of nextUrls) {
            pages = await crawlPage(baseUrl, nextUrl, pages);
        }
    } catch (error) {
        console.log(`error in fetch: ${error.message}, on page ${currentUrl}`);   
        throw Error(error.message);
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

function geOnPageSEORelatedInfo(htmlBody) {
    const object = {};
    const dom = new JSDOM(htmlBody);
    object.titleRelated = {};
    let title = dom.window.document.title;
    object.titleRelated.title = title;
    object.titleRelated.suggestion = title.length < 20 || title.length > 60 ? 'recommend using a title with a length <b>between 20 - 60 characters</b> in order to fit Google Search results that have a 600-pixel limit.' : 'You have a title tag of optimal length (between 10 and 60 characters).'

    object.descriptionRelated = {};
    let metaDescription = dom.window.document.querySelector('meta[name="description"]')?.content;
    object.descriptionRelated.description = metaDescription;
    object.descriptionRelated.suggestion = !metaDescription || (metaDescription?.length < 150 || metaDescription?.length > 220) ? 'recommend using well-written and inviting meta descriptions with a length between 150 and 220 characters (spaces included).' : 'Your page has a meta description of optimal length (between 150 and 220 characters).'

    // other meta elements
    const metaElements = dom.window.document.querySelectorAll('meta');
    object.metaElements = {};
    object.metaElements.twitterCard = [];
    object.metaElements.ogTags = [];

    for (const meta of metaElements) {
        // console.log(meta.getAttribute('name') || meta.getAttribute('property'), meta.getAttribute('content'));

        if (meta.getAttribute('name') && meta.getAttribute('name').includes('twitter')) {
            object.metaElements.twitterCard.push({
                attrName: meta.getAttribute('name'),
                content: meta.getAttribute('content'),
            })
        }

        if (meta.getAttribute('property') && meta.getAttribute('property').includes('og')) {
            object.metaElements.ogTags.push({
                attrName: meta.getAttribute('property'),
                content: meta.getAttribute('content'),
            })
        }
    }

    // Head tags
    object.headTags = {};
    // h1 tags
    const h1Tags = dom.window.document.querySelectorAll('h1');
    object.headTags.h1Tags = {};
    object.headTags.h1Tags.suggestion = h1Tags && h1Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h1Tags?.length} h1 tags in page`
    object.headTags.h1Tags.tags = [];
    for (const h1 of h1Tags) {
        object.headTags.h1Tags.tags.push(h1.innerText || h1.textContent)
    }

    const h2Tags = dom.window.document.querySelectorAll('h2');
    object.headTags.h2Tags = {};
    object.headTags.h2Tags.suggestion = h2Tags && h2Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h2Tags?.length} h1 tags in page`
    object.headTags.h2Tags.tags = [];
    for (const h2 of h2Tags) {
        object.headTags.h2Tags.tags.push(h2.innerText || h2.textContent)
    }

    const h3Tags = dom.window.document.querySelectorAll('h3');
    object.headTags.h3Tags = {};
    object.headTags.h3Tags.suggestion = h3Tags && h3Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h3Tags?.length} h1 tags in page`
    object.headTags.h3Tags.tags = [];
    for (const h3 of h3Tags) {
        object.headTags.h3Tags.tags.push(h3.innerText || h3.textContent)
    }

    const h4Tags = dom.window.document.querySelectorAll('h4');
    object.headTags.h4Tags = {};
    object.headTags.h4Tags.suggestion = h4Tags && h4Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h4Tags?.length} h1 tags in page`
    object.headTags.h4Tags.tags = [];
    for (const h4 of h4Tags) {
        object.headTags.h4Tags.tags.push(h4.innerText || h4.textContent)
    }

    const h5Tags = dom.window.document.querySelectorAll('h5');
    object.headTags.h5Tags = {};
    object.headTags.h5Tags.suggestion = h5Tags && h5Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h5Tags?.length} h1 tags in page`
    object.headTags.h5Tags.tags = [];
    for (const h5 of h5Tags) {
        object.headTags.h5Tags.tags.push(h5.innerText || h5.textContent)
    }

    const h6Tags = dom.window.document.querySelectorAll('h6');
    object.headTags.h6Tags = {};
    object.headTags.h6Tags.suggestion = h6Tags && h6Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h6Tags?.length} h1 tags in page`
    object.headTags.h6Tags.tags = [];
    for (const h6 of h6Tags) {
        object.headTags.h6Tags.tags.push(h6.innerText || h6.textContent)
    }

    let canonicalTag = dom.window.document.querySelector("link[rel='canonical']")?.href;
    object.canonicalTag = {};
    object.canonicalTag.href = canonicalTag;
    object.canonicalTag.suggestion = canonicalTag ? 'Your page is using the Canonical Tag.' : 'Your page is not using the Canonical Tag.';

    // console.log(object)
    return object;
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