function printReport(pages) {
    console.log("=======================");
    console.log("=========REPORT========");
    console.log("=======================");

    const sortedPages = sortPages(pages);

    for (const sortedPage of sortedPages) {
        const url = sortedPage.url;
        const occurrence = sortedPage.occurrence;
        console.log(`Found ${occurrence} links to page ${url}`);
    }

    console.log("=======================");
    console.log("==========End==========");
    console.log("=======================");
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

module.exports = { sortPages, printReport };