function reportContent(baseUrl, pages) {
    const tableBodyContent = generateTableContent(pages);

    const imageContent = generateImageAnalysisContent(pages);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crawlyx - Report</title>
    <!-- favicon -->
    <link rel="icon" type="image/x-icon" href="https://raw.githubusercontent.com/theritikchoure/theritikchoure/main/media/crawlyx-logo-rounded.png" />
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css">
    <script src="https://cdn.tailwindcss.com"></script>
    <style>
        html {
            scroll-behavior: smooth;
        }
        body {
            margin:0;
        }
        table {
            border-collapse: collapse;
            border-spacing: 0;
            width: 100%;
            border: 1px solid #ddd;
        }

        th,
        td {
            text-align: left;
            padding: 16px;
        }

        tr:nth-child(even) {
            background-color: #f2f2f2;
        }

        .text-center {
            text-align: center;
        }

        .tooltip {
            position: relative;
            display: inline-block;
        }
          
        .tooltip .tooltiptext {
            visibility: hidden;
            width: 183px;
            background-color: #e2e2e2;
            color: black;
            text-align: center;
            border-radius: 6px;
            padding: 15px 15px;
            position: absolute;
            z-index: 1;
            bottom: 95%;
            font-weight: 400;
            left: 50%;
            font-size: 14px;
            margin-left: -111px;
        }
          
        .tooltip .tooltiptext::after {
            content: "";
            position: absolute;
            top: 100%;
            left: 50%;
            margin-left: -5px;
            border-width: 5px;
            border-style: solid;
            border-color: #e2e2e2 transparent transparent transparent;
        }
          
        .tooltip:hover .tooltiptext {
            visibility: visible;
        }

        
        .sidebar {
            margin: 0;
            padding: 0;
            width: 200px;
            background-color: #f1f1f1;
            position: fixed;
            height: 100%;
            overflow: auto;
        }

        .sidebar a {
            display: block;
            color: black;
            padding: 16px;
            text-decoration: none;
        }

        .sidebar a.active {
            background-color: #04AA6D;
            color: white;
        }

        .sidebar a:hover:not(.active) {
            background-color: #555;
            color: white;
        }

        .sidebar a i {
            margin-right: 7px;
        }

        div.main {
            margin-left: 200px;
            padding: 1px 16px;
        }

        @media screen and (max-width: 700px) {
            .sidebar {
                width: 100%;
                height: auto;
                position: relative;
            }

            .sidebar a {
                float: left;
            }

            div.main {
                margin-left: 0;
            }
        }

        #btn-back-to-top {
            position: fixed;
            display: none;
        }

        .accordion {
            color: #444;
            cursor: pointer;
            padding: 18px;
            width: 100%;
            border: none;
            text-align: left;
            outline: none;
            font-size: 15px;
            transition: 0.4s;
            border-bottom: 1px solid #e2e2e2;
        }

        .active,
        .accordion:hover {
            background-color: #ccc;
        }

        .accordion:after {
            content: '\u002B';
            color: #777;
            font-weight: bold;
            float: right;
            margin-left: 5px;
        }

        .accordion.active:after {
            content: "\u2212";
        }


        .panel {
            padding: 0 18px;
            background-color: white;
            max-height: 0;
            overflow: hidden;
            transition: max-height 0.2s ease-out;
        }
    </style>
</head>

<body>

    <div class="sidebar">
        <a class="active" href="#home" onclick="changeMenu(event)"> <i class="fa fa-fw fa-home"></i>Home</a>
        <a href="#links" onclick="changeMenu(event)"><i class="fa fa-fw fa-link"></i>Links</a>
        <a href="#image-analytics" onclick="changeMenu(event)"><i class="fa fa-fw fa-image"></i>Image analytics</a>
        <a href="javascript:void(0)" onclick="printDiv('home')"><i class="fa fa-fw fa-print"></i>Print report</a>
        <a href="#help" onclick="changeMenu(event)"><i class="fa fa-fw fa-question"></i>Help</a>
    </div>

    <div class="main mb-12" id="home">
        <h2 class="text-center text-3xl font-semibold text-black mt-4"><u>Crawlyx - Report</u></h2>

        <div id="data-display">
            <div class="max-w-full mx-4 py-6 sm:mx-auto sm:px-6 lg:px-8">
                <div class="sm:flex sm:space-x-4">
                    <div
                        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                        <div class="bg-white p-5">
                            <div class="sm:flex sm:items-start">
                                <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                                    <h3 class="text-sm leading-6 font-medium text-gray-400">Base url</h3>
                                    <p class="text-xl font-bold text-black">${baseUrl}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                        <div class="bg-white p-5">
                            <div class="sm:flex sm:items-start">
                                <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                                    <h3 class="text-sm leading-6 font-medium text-gray-400">Total Links Crawled</h3>
                                    <p class="text-xl font-bold text-black">${pages.length}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div
                        class="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow transform transition-all mb-4 w-full sm:w-1/3 sm:my-8">
                        <div class="bg-white p-5">
                            <div class="sm:flex sm:items-start">
                                <div class="text-center sm:mt-0 sm:ml-2 sm:text-left">
                                    <h3 class="text-sm leading-6 font-medium text-gray-400">Report generated at</h3>
                                    <p class="text-xl font-bold text-black">${(new Date).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div class="links mb-8 bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]" id="links">
            <h3 class="text-center text-2xl font-semibold text-black mb-8">Crawled links</h3>
            <table>
                <tr>
                    <th>#</th>
                    <th>Link</th>
                    <th class="tooltip">
                        Occurrence
                        <span class="tooltiptext">How many times a certain page is linked to the site</span>
                    </th>
                    <th>
                        Status code
                    </th>
                </tr>
                ${tableBodyContent}
            </table>
        </div>

        
        <div class="links mb-8 bg-white p-6 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)]"
            id="image-analytics">
            <h3 class="text-center text-2xl font-semibold text-black mb-8">Image Analysis</h3>

            ${imageContent}
        </div>
    </div>
    <footer class="bg-neutral-100 text-center lg:text-left">
        <div class="p-4 text-center">
            © 2023: made with 🖤 by Ritik for a better web.
        </div>
    </footer>
    <button type="button" data-mdb-ripple="true" data-mdb-ripple-color="light"
        class="inline-block p-3 bg-green-500 text-white font-medium text-xs leading-tight uppercase rounded-full shadow-md hover:bg-green-800 hover:shadow-lg focus:bg-green-800 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-green-500 active:shadow-lg transition duration-150 ease-in-out bottom-5 right-5"
        id="btn-back-to-top">
        <svg aria-hidden="true" focusable="false" data-prefix="fas" class="w-4 h-4" role="img"
            xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
            <path fill="currentColor"
                d="M34.9 289.5l-22.2-22.2c-9.4-9.4-9.4-24.6 0-33.9L207 39c9.4-9.4 24.6-9.4 33.9 0l194.3 194.3c9.4 9.4 9.4 24.6 0 33.9L413 289.4c-9.5 9.5-25 9.3-34.3-.4L264 168.6V456c0 13.3-10.7 24-24 24h-32c-13.3 0-24-10.7-24-24V168.6L69.2 289.1c-9.3 9.8-24.8 10-34.3.4z">
            </path>
        </svg>
    </button>
    <script>
        // Get the button
        let mybutton = document.getElementById("btn-back-to-top");

        // When the user scrolls down 20px from the top of the document, show the button
        window.onscroll = function () {
            scrollFunction();
        };

        function scrollFunction() {
            if (
                document.body.scrollTop > 20 ||
                document.documentElement.scrollTop > 20
            ) {
                mybutton.style.display = "block";
            } else {
                mybutton.style.display = "none";
            }
        }
        // When the user clicks on the button, scroll to the top of the document
        mybutton.addEventListener("click", backToTop);

        function backToTop() {
            document.body.scrollTop = 0;
            document.documentElement.scrollTop = 0;
        }

        function printDiv(divName) {
            let printContents = document.getElementById(divName).innerHTML;
            let originalContents = document.body.innerHTML;
            document.body.innerHTML = printContents;
            window.print();
            document.body.innerHTML = originalContents;
        }

        function changeMenu(e) {
            let elems = document.querySelectorAll(".sidebar .active");
            [].forEach.call(elems, function (el) {
                el.classList.remove("active");
            });
            e.target.className = "active";
        }
    </script>

    <script>
        // add event listeners to the image analysis elements
        var acc = document.getElementsByClassName("accordion");
        var i;

        for (i = 0; i < acc.length; i++) {
            acc[i].addEventListener("click", function () {
                this.classList.toggle("active");
                var panel = this.nextElementSibling;
                if (panel.style.maxHeight) {
                    panel.style.maxHeight = null;
                } else {
                    panel.style.maxHeight = panel.scrollHeight + "px";
                }
            });
        }
    </script>

</body>

</html>
    `;

    return htmlContent;
}

function generateTableContent(pages) {
    let tableContent = '';
    let serialNumber = 1;

    for (const page of pages) {
        const tr = `
        <tr>
            <td>${serialNumber}</td>
            <td>${page.url}</td>
            <td>${page.occurrence}</td>
            <td>${page.statusCode}</td>
        </tr>
        `;

        tableContent = tableContent + tr;
        serialNumber++;
    }

    return tableContent;
}

function generateImageAnalysisContent(pages) {
    let templateContent = '';
    for (const page of pages) {
        let panelContent = '';
        if (page.images) {
            let tableForImageWithAltText = '';
            let tableForImageWithoutAltText = '';

            // Images with alt text
            if (page.images?.withAltText.length > 0) {
                let iwalt = '';
                let serialNumber = 1;
                for (const imageWithAlt of page.images?.withAltText) {
                    let a = `
                    <tr>
                        <td>${serialNumber}</td>
                        <td>${imageWithAlt.imageSrc}</td>
                        <td>${imageWithAlt.altText}</td>
                        <td><a href=${imageWithAlt.imageSrc} target="_blank">
                            <i class="fa fa-fw fa-eye"></i>
                        </a></td>
                    </tr>
                    `;

                    iwalt = iwalt + a;
                    serialNumber++;
                }

                tableForImageWithAltText = `
                <h4 class="text-center text-lg my-4">Image with alt text</h4>
                <table class="mb-4">
                    <tr>
                        <th>#</th>
                        <th>Image src</th>
                        <th>Alt text</th>
                        <th>View image</th>
                    </tr>

                    ${iwalt}
                </table>
                `;

            } else {
                tableForImageWithAltText = `
                <h4 class="text-center text-lg my-4">Image with alt text</h4>
                <p class="text-center my-4">No images found with alt text </td>
                `;
            }

            // Images without alt text
            if (page.images?.withoutAltText.length > 0) {
                let iwoalt = '';
                let serialNumber = 1;
                for (const imageWithoutAlt of page.images?.withoutAltText) {
                    let a = `
                    <tr>
                        <td>${serialNumber}</td>
                        <td>${imageWithoutAlt.imageSrc}</td>
                        <td><a href=${imageWithoutAlt.imageSrc} target="_blank">
                            <i class="fa fa-fw fa-eye"></i>
                        </a></td>
                    </tr>
                    `;

                    iwoalt = iwoalt + a;
                    serialNumber++;
                }

                tableForImageWithoutAltText = `
                <h4 class="text-center text-lg my-4">Image without alt text</h4>
                <table class="mb-4">
                    <tr>
                        <th>#</th>
                        <th>Image src</th>
                        <th>View image</th>
                    </tr>

                    ${iwoalt}
                </table>
                `;
            } else {
                tableForImageWithoutAltText = `
                <h4 class="text-center text-lg my-4">Image without alt text</h4>
                <p class="text-center my-4"> No images found with alt text </td>
                `;
            }

            if(page.images.withAltText.length === 0 && page.images.withoutAltText.length === 0) {
                panelContent = '<p class="text-center my-4">No image found on page </td>';
            } else {
                panelContent = `
                    ${tableForImageWithAltText}
                    ${tableForImageWithoutAltText}
                    `;
            }
        } else {
            panelContent = '<p class="text-center my-4">No image found on page </p>';
        }

        let a = `
        <button class="accordion">${page.url}</button>
        <div class="panel">
            ${panelContent}
        </div>
        `;

        templateContent = templateContent + a;
    }

    return templateContent;
}

module.exports = { reportContent };