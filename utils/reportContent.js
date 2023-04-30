function reportContent(baseUrl, pages) {
    const tableBodyContent = generateTableContent(pages);

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Crawlyx - Report</title>
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
    </style>
</head>

<body>

    <div class="sidebar">
        <a class="active" href="#home" onclick="changeMenu(event)"> <i class="fa fa-fw fa-home"></i>Home</a>
        <a href="#links" onclick="changeMenu(event)"><i class="fa fa-fw fa-link"></i>Links</a>
        <a href="#keywords" onclick="changeMenu(event)"><i class="fa fa-fw fa-cloud"></i>Keywords</a>
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
    </div>
    <footer class="bg-neutral-100 text-center lg:text-left">
        <div class="p-4 text-center">
            © 2023: made with 🖤 by Ritik for a better web.
        </div>
    </footer>
    <script>
        function changeMenu(e) {
            let elems = document.querySelectorAll(".sidebar .active");
            [].forEach.call(elems, function (el) {
                el.classList.remove("active");
            });
            e.target.className = "active";
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

module.exports = { reportContent };