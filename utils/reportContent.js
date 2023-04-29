function reportContent(pages) {
    const tableBodyContent = generateTableContent(pages);

    const htmlContent = `
    <!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>

    <style>
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
    </style>
</head>

<body>
    <h2 class="text-center">Awesome Report</h2>
    <p class="text-center">Report generated: ${(new Date).toLocaleString()}</h2>

    <table>
        <tr>
            <th>#</th>
            <th>Link</th>
            <th>Occurrence</th>
        </tr>
        ${tableBodyContent}
    </table>

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
        </tr>
        `;
        
        tableContent = tableContent + tr;
        serialNumber++;
    }

    return tableContent;
}

module.exports = { reportContent };