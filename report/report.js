const fs = require('fs');
const { exec } = require("child_process");
const { reportContent } = require("../utils/reportContent");

function generateReport(pages) {
    const sortedPages = sortPages(pages);

    const htmlContent = reportContent(sortedPages);

    fs.mkdirSync(`${process.cwd()}/awesome-report`, { recursive: true },);
    let reportFilePath = `${process.cwd()}/awesome-report/report.html`;
    fs.writeFileSync(reportFilePath, htmlContent);


    console.log("=========================================================");
    console.log(`\x1b[22;92mReport generated successfully \x1b[0m`);
    console.log(reportFilePath);
    exec(`start ${reportFilePath}`);
}


function sortPages(pages) {
    const pagesArr = Object.entries(pages);

    pagesArr.sort((a, b) => {
        let aHits = a[1];
        let bHits = b[1];

        return b[1] - a[1];
    })

    let res = [];
    for (const page of pagesArr) {
        let object = {};
        object.url = page[0];
        object.occurrence = page[1];

        res.push(object);
    };

    return res;
}

module.exports = { sortPages, generateReport };