const { JSDOM } = require('jsdom');
const fs = require('fs');
const { exec } = require("child_process");
const { reportContent } = require("../utils/reportContent");

function generateReport(baseUrl, pages) {
    const sortedPages = sortPages(pages);

    console.log(sortedPages)

    const htmlContent = reportContent(baseUrl, sortedPages);

    fs.mkdirSync(`${__dirname}/awesome-report`, { recursive: true },);
    let reportFilePath = `${__dirname}/awesome-report/report.html`;
    fs.writeFileSync(reportFilePath, htmlContent);


    console.log("=========================================================");
    console.log(`\x1b[22;92mReport generated successfully \x1b[0m`);
    console.log(reportFilePath);
    exec(`start ${reportFilePath}`);
}


function sortPages(pages) {
    const pagesArr = Object.entries(pages);

    pagesArr.sort((a, b) => {
        return b[1]?.occurrence - a[1]?.occurrence;
    })

    let res = [];
    for (const page of pagesArr) {
        let object = {};
        object.url = page[0];
        object.occurrence = page[1]?.occurrence;
        // object.htmlBody = page[1]?.htmlBody;
        object.images = page[1]?.images;
        object.statusCode = page[1]?.statusCode;
        res.push(object);
    };

    return res;
}

function generateKeywordsAnalytics(pages) {
    // Step 2: Extract the text content from the HTML
    let textContents = [];
    for (const page of pages) {
        let object = {};
        object.url = page.url
        const dom = new JSDOM(page.htmlBody);
        const temp = dom.window.document.createElement('div');
        temp.innerHTML = page.htmlBody;
        const textContent = temp.textContent || temp.innerText; // extract the text content
        const cleanContent = textContent.replace(/(<([^>]+)>)/gi, ''); // clean the content
        const tokenizedContent = cleanContent.split(/\W+/); // tokenize the content
        const keywordCounts = {};
        for (const word of tokenizedContent) {
            if (word in keywordCounts) {
                keywordCounts[word]++;
            } else {
                keywordCounts[word] = 1;
            }
        }

        const keywordsArr = Object.entries(keywordCounts);
        keywordsArr.sort((a, b) => {
            // console.log(a);
            return b[1] - a[1];
        });

        let res = [];
        for (const keyword of keywordsArr) {
            let object = {};
            object.keyword = keyword[0];
            object.occurrence = keyword[1];
            res.push(object);
        };

        object.keywordCounts = res;
        textContents.push(object);
    };

    console.log(textContents[5]);
    return textContents;
}


module.exports = { sortPages, generateReport };