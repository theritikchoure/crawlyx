const { JSDOM } = require('jsdom');
const fetch = require('node-fetch');

/**
 * Crawls a web page and its linked pages.
 *
 * @param {string} baseUrl - The base URL of the website to start crawling.
 * @param {string} currentUrl - The current URL to crawl.
 * @param {Object} pages - An object to store information about crawled pages.
 * @returns {Promise<Object>} - An updated 'pages' object with crawled data.
 */
async function crawlPage(baseUrl, currentUrl, pages) {
    // Parse the base URL and current URL into URL objects.
    const baseUrlObject = new URL(baseUrl);
    const currentUrlObject = new URL(currentUrl);

    // Check if the hostnames of the base and current URLs differ; if so, stop crawling.
    if (baseUrlObject.hostname !== currentUrlObject.hostname) {
        return pages;
    }

    // Normalize the current URL to ensure consistent representation.
    const normalizedCurrentUrl = normalizeUrl(currentUrl);

    // Check if the normalized URL has already been crawled.
    if (pages[normalizedCurrentUrl]?.occurrence > 0) {
        // Update the occurrence count and return the 'pages' object.
        pages[normalizedCurrentUrl] = { ...pages[normalizedCurrentUrl], occurrence: pages[normalizedCurrentUrl]?.occurrence + 1 };
        return pages;
    }

    // Initialize a new entry for the current URL in the 'pages' object.
    pages[normalizedCurrentUrl] = {
        occurrence: 1
    };

    // Log that the crawler is currently processing the current URL.
    console.log(`currently crawling: ${currentUrl}`);

    try {
        // Fetch the content of the current URL.
        const res = await fetch(currentUrl);

        // Update the 'pages' object with the HTTP status code of the current URL.
        pages[normalizedCurrentUrl] = { ...pages[normalizedCurrentUrl], statusCode: res.status };

        // Check if the HTTP status code indicates an error (e.g., 4xx or 5xx).
        if (res.status > 399) {
            console.log(`error in fetch with status ${res.status} on page ${currentUrl}`);
            return pages;
        }

        // Retrieve the 'Content-Type' header to verify it is HTML content.
        const contentType = res.headers.get('content-type');
        if (!contentType.includes("text/html")) {
            console.log(`non-HTML response, content-type: ${contentType} on page ${currentUrl}`);
            return pages;
        }

        // Read the HTML content of the page.
        const htmlBody = await res.text();
        pages[normalizedCurrentUrl] = { ...pages[normalizedCurrentUrl], htmlBody };

        // Extract image data from the HTML content.
        const images = getAllImagesFromHtml(htmlBody, baseUrl);
        pages[normalizedCurrentUrl] = { ...pages[normalizedCurrentUrl], images };

        // Extract on-page SEO-related information.
        const onPageSEODetails = geOnPageSEORelatedInfo(htmlBody);
        pages[normalizedCurrentUrl] = { ...pages[normalizedCurrentUrl], onPageSEODetails };

        // Extract URLs from the HTML content.
        const nextUrls = getURLsFromHTML(htmlBody, baseUrl);

        // Recursively crawl the extracted URLs.
        for (const nextUrl of nextUrls) {
            pages = await crawlPage(baseUrl, nextUrl, pages);
        }
    } catch (error) {
        console.log(`error in fetch: ${error.message}, on page ${currentUrl}`);
        throw Error(error.message);
    }

    return pages;
}

/**
 * Extracts URLs from the HTML content of a page.
 *
 * @param {string} htmlBody - The HTML content of the page.
 * @param {string} baseURL - The base URL for resolving relative URLs.
 * @returns {string[]} - An array of URLs found in the HTML content.
 */
function getURLsFromHTML(htmlBody, baseURL) {
    const urls = [];
    const dom = new JSDOM(htmlBody);
    const linkElements = dom.window.document.querySelectorAll('a');

    for (const linkElement of linkElements) {
        // Check if the URL is relative or absolute and add it to the 'urls' array.
        if (linkElement.href.slice(0, 1) === '/') {
            // Relative URL
            try {
                const urlObject = new URL(`${baseURL}${linkElement.href}`);
                urls.push(urlObject.href);
            } catch (error) {
                console.log(`error with relative URL: ${error.message}`);
            }
        } else {
            // Absolute URL
            try {
                const urlObject = new URL(linkElement.href);
                urls.push(urlObject.href);
            } catch (error) {
                console.log(`error with absolute URL: ${error.message}`);
            }
        }
    }

    return urls;
}

/**
 * Extracts information about images in the HTML content of a page.
 *
 * @param {string} htmlBody - The HTML content of the page.
 * @param {string} baseURL - The base URL for resolving image source URLs.
 * @returns {Object} - An object containing categorized image data.
 */
function getAllImagesFromHtml(htmlBody, baseURL) {
    const images = {};
    images.withAltText = [];
    images.withoutAltText = [];
    const dom = new JSDOM(htmlBody);
    const imageElements = dom.window.document.querySelectorAll('img');

    for (const imageElement of imageElements) {
        let imageSrc = '';
        if (imageElement.src.slice(0, 1) === '/') {
            imageSrc = (new URL(`${baseURL}${imageElement.src}`)).href;
        } else {
            imageSrc = (new URL(imageElement.src)).href;
        }

        if (imageElement.alt === '' || imageElement.alt === undefined || imageElement.alt === null) {
            // Image without alt text
            try {
                let object = {};
                object.imageSrc = imageSrc;
                object.altText = imageElement.alt;
                images.withoutAltText.push(object);
            } catch (error) {
                console.log(`error with image without alt text: ${error.message}`);
            }
        } else {
            // Images with alt text
            let object = {};
            object.imageSrc = imageSrc;
            object.altText = imageElement.alt;
            try {
                images.withAltText.push(object);
            } catch (error) {
                console.log(`error with absolute URL: ${error.message}`);
            }
        }
    }

    return images;
}

/**
 * Extracts on-page SEO-related information from the HTML content of a page.
 *
 * @param {string} htmlBody - The HTML content of the page.
 * @returns {Object} - An object containing on-page SEO-related details.
 */
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

    // Extract other meta elements, such as Twitter and Open Graph tags.
    const metaElements = dom.window.document.querySelectorAll('meta');
    object.metaElements = {};
    object.metaElements.twitterCard = [];
    object.metaElements.ogTags = [];

    for (const meta of metaElements) {
        // Check the attribute name and content and categorize the meta elements.
        if (meta.getAttribute('name') && meta.getAttribute('name').includes('twitter')) {
            object.metaElements.twitterCard.push({
                attrName: meta.getAttribute('name'),
                content: meta.getAttribute('content'),
            });
        }

        if (meta.getAttribute('property') && meta.getAttribute('property').includes('og')) {
            object.metaElements.ogTags.push({
                attrName: meta.getAttribute('property'),
                content: meta.getAttribute('content'),
            });
        }
    }

    // Extract head tags (h1, h2, h3, etc.) and canonical URL.
    object.headTags = {};
    const h1Tags = dom.window.document.querySelectorAll('h1');
    object.headTags.h1Tags = {};
    object.headTags.h1Tags.suggestion = h1Tags && h1Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h1Tags?.length} h1 tags in page`;
    object.headTags.h1Tags.tags = [];
    for (const h1 of h1Tags) {
        object.headTags.h1Tags.tags.push(h1.innerText || h1.textContent);
    }

    // Extract h2, h3, h4, h5, and h6 tags similarly.
    const h2Tags = dom.window.document.querySelectorAll('h2');
    object.headTags.h2Tags = {};
    object.headTags.h2Tags.suggestion = h2Tags && h2Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h2Tags?.length} h1 tags in page`;
    object.headTags.h2Tags.tags = [];
    for (const h2 of h2Tags) {
        object.headTags.h2Tags.tags.push(h2.innerText || h2.textContent);
    }

    // Extract h3 tags and similar tags (h4, h5, h6).
    const h3Tags = dom.window.document.querySelectorAll('h3');
    object.headTags.h3Tags = {};
    object.headTags.h3Tags.suggestion = h3Tags && h3Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h3Tags?.length} h1 tags in page`;
    object.headTags.h3Tags.tags = [];
    for (const h3 of h3Tags) {
        object.headTags.h3Tags.tags.push(h3.innerText || h3.textContent);
    }

    // Extract h4 tags and similar tags (h5, h6).
    const h4Tags = dom.window.document.querySelectorAll('h4');
    object.headTags.h4Tags = {};
    object.headTags.h4Tags.suggestion = h4Tags && h4Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h4Tags?.length} h1 tags in page`;
    object.headTags.h4Tags.tags = [];
    for (const h4 of h4Tags) {
        object.headTags.h4Tags.tags.push(h4.innerText || h4.textContent);
    }

    // Extract h5 tags.
    const h5Tags = dom.window.document.querySelectorAll('h5');
    object.headTags.h5Tags = {};
    object.headTags.h5Tags.suggestion = h5Tags && h5Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h5Tags?.length} h1 tags in page`;
    object.headTags.h5Tags.tags = [];
    for (const h5 of h5Tags) {
        object.headTags.h5Tags.tags.push(h5.innerText || h5.textContent);
    }

    // Extract h6 tags.
    const h6Tags = dom.window.document.querySelectorAll('h6');
    object.headTags.h6Tags = {};
    object.headTags.h6Tags.suggestion = h6Tags && h6Tags?.length > 1 ? 'Recommended only 1 h1 tag in a page' : `found ${h6Tags?.length} h1 tags in page`;
    object.headTags.h6Tags.tags = [];
    for (const h6 of h6Tags) {
        object.headTags.h6Tags.tags.push(h6.innerText || h6.textContent);
    }

    // Extract the canonical URL if available.
    let canonicalTag = dom.window.document.querySelector("link[rel='canonical']")?.href;
    object.canonicalTag = {};
    object.canonicalTag.href = canonicalTag;
    object.canonicalTag.suggestion = canonicalTag ? 'Your page is using the Canonical Tag.' : 'Your page is not using the Canonical Tag.';

    return object;
}

/**
 * Normalizes a URL by removing trailing slashes.
 *
 * @param {string} url - The URL to be normalized.
 * @returns {string} - The normalized URL.
 */
function normalizeUrl(url) {
    // Parse the URL into a URL object.
    const urlObject = new URL(url);
    const hostPath = `${urlObject.hostname}${urlObject.pathname}`;

    // Remove the trailing slash from the host path, if present.
    if (hostPath.length > 0 && hostPath.slice(-1) === '/') {
        return hostPath.slice(0, -1);
    }

    return hostPath;
}

module.exports = { crawlPage, getURLsFromHTML, normalizeUrl };
