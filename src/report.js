const { JSDOM } = require('jsdom');
const fs = require('fs');
const { exec } = require("child_process");
const { reportContent, jsonReportContent } = require("../utils/reportContent");

/**
 * Generates a report for the given base URL and crawled pages.
 * This function sorts the pages by occurrence and generates both HTML and JSON reports.
 *
 * @param {string} baseUrl - The base URL of the website that was crawled.
 * @param {Object} pages - An object containing information about crawled pages.
 */
function generateReport(baseUrl, pages) {
    // Step 1: Sort the crawled pages by occurrence.
    const sortedPages = sortPages(pages);

    // Step 2: Generate an HTML report.
    const htmlContent = reportContent(baseUrl, sortedPages);

    // Step 3: Generate a JSON report.
    const jsonContent = jsonReportContent(baseUrl, sortedPages);

    // Step 4: Create a directory for the report.
    fs.mkdirSync(`${__dirname}/awesome-report`, { recursive: true });

    // Step 5: Write the HTML report to a file.
    let reportFilePath = `${__dirname}/awesome-report/report.html`;
    fs.writeFileSync(reportFilePath, htmlContent);

    // Step 6: Write the JSON report to a file.
    let jsonReportFilePath = `${__dirname}/awesome-report/report.json`;
    fs.writeFileSync(jsonReportFilePath, JSON.stringify(jsonContent));

    // Step 7: Open the HTML report in the default web browser.
    console.log("=========================================================");
    console.log(`\x1b[22;92mReport generated successfully \x1b[0m`);
    console.log(`Report path: `, reportFilePath);
    exec(`start ${reportFilePath}`);
}

/**
 * Sorts crawled pages by the number of occurrences in descending order.
 *
 * @param {Object} pages - An object containing information about crawled pages.
 * @returns {Array} - An array of sorted pages.
 */
function sortPages(pages) {
    const pagesArr = Object.entries(pages);

    pagesArr.sort((a, b) => {
        return b[1]?.occurrence - a[1]?.occurrence;
    });

    let res = [];
    for (const page of pagesArr) {
        let object = {};
        object.url = page[0];
        object.occurrence = page[1]?.occurrence;
        // object.htmlBody = page[1]?.htmlBody;
        object.images = page[1]?.images;
        object.statusCode = page[1]?.statusCode;
        res.push(object);
    }

    return res;
}

/**
 * Generates keyword analytics for the text content of crawled pages.
 *
 * @param {Array} pages - An array of pages with text content.
 * @returns {Array} - An array of keyword analytics for each page.
 */
function generateKeywordsAnalytics(pages) {
    let textContents = [];
    for (const page of pages) {
        let object = {};
        object.url = page.url;

        // Step 1: Extract the text content from the HTML.
        const dom = new JSDOM(page.htmlBody);
        const temp = dom.window.document.createElement('div');
        temp.innerHTML = page.htmlBody;
        const textContent = temp.textContent || temp.innerText; // extract the text content

        // Step 2: Clean the text content.
        const cleanContent = textContent.replace(/(<([^>]+)>)/gi, '');

        // Step 3: Tokenize the clean content.
        const tokenizedContent = cleanContent.split(/\W+/);

        // Step 4: Count the occurrences of each keyword.
        const keywordCounts = {};
        for (const word of tokenizedContent) {
            if (word in keywordCounts) {
                keywordCounts[word]++;
            } else {
                keywordCounts[word] = 1;
            }
        }

        // Step 5: Sort keywords by occurrence in descending order.
        const keywordsArr = Object.entries(keywordCounts);
        keywordsArr.sort((a, b) => {
            return b[1] - a[1];
        });

        let res = [];
        for (const keyword of keywordsArr) {
            let object = {};
            object.keyword = keyword[0];
            object.occurrence = keyword[1];
            res.push(object);
        }

        object.keywordCounts = res;
        textContents.push(object);
    }

    console.log(textContents[5]);
    return textContents;
}

module.exports = { sortPages, generateReport, generateKeywordsAnalytics };
