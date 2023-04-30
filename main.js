const { crawlPage } = require('./crawl');
const { generateReport } = require('./report/report');
const package = require('./package');

exports.mainFunction = main;

async function main() {
    if(process.argv.length < 3) {
        console.log('no website provided');
        process.exit(1);
    }
    
    if(process.argv.length > 3) {
        console.log('too many arguments');
        process.exit(1);
    }

    const baseUrl = (new URL(process.argv[2])).origin;

    if(baseUrl === '--version' || baseUrl === '--v') {
        console.log(`> ${package.version}`);
        process.exit(1);
    }

    console.log(`starting crawl of ${baseUrl}`)
    const pages = await crawlPage(baseUrl, baseUrl, {});

    generateReport(baseUrl, pages);
}

// main();