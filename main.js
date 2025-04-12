// Import the 'crawlPage' function from the 'crawl' module and the 'generateReport' function from the 'report' module.
const { crawlPage } = require('./src/crawl');
const { generateReport } = require('./src/report');

// Import the 'package' module to access version information.
const package = require('./package');

// Define the main export 'mainFunction' which contains the 'main' function.
exports.mainFunction = main;

// Define the 'main' function, which serves as the entry point for the application.
async function main() {
  // Check if there are fewer than 3 command-line arguments.
  if (process.argv.length < 3) {
    console.log("no website provided");
    process.exit(1); // Exit with an error code.
  }

  // Check if there are more than 3 command-line arguments.
  if (process.argv.length > 3) {
    console.log("too many arguments");
    process.exit(1); // Exit with an error code.
  }

  const argument = process.argv[2];

  // Check if the command-line argument is '--version' or '--v'.
  if (argument === "--version" || argument === "--v") {
    console.log(`> ${package.version}`); // Print the package version.
    process.exit(1); // Exit with an error code.
  }

  // Extract the base URL from the command-line argument, assuming it's a valid URL.
  const baseUrl = new URL(process.argv[2]).origin;

  // Print a message indicating the start of the crawl for the provided URL.
  console.log(`starting crawl of ${baseUrl}`);

  // Call the 'crawlPage' function to crawl the website and retrieve the 'pages' data.
  const pages = await crawlPage(baseUrl, baseUrl, {});

  // Generate a report based on the crawled data for the specified 'baseUrl'.
  generateReport(baseUrl, pages);
}

// The 'main' function is currently commented out. To execute the code directly from terminal, uncomment the 'main' function.
main();
