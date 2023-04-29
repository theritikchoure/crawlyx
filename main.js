const { crawlPage } = require('./crawl');
const { printReport } = require('./report/report');

async function main() {
    if(process.argv.length < 3) {
        console.log('no website provided');
        process.exit(1)
    }
    
    if(process.argv.length > 3) {
        console.log('too many arguments');
        process.exit(1)
    }

    const baseUrl = process.argv[2];

    console.log(`starting crawl of ${baseUrl}`)
    const pages = await crawlPage(baseUrl, baseUrl, {});

    // for (const page of Object.entries(pages)) {
    //     console.log(page)
    // }

    printReport(pages);

}

main();