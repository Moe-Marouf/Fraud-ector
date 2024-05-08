function generatePDF() {
    // Get table element
    var table = document.getElementById("transaction-table");

    // Prepare data array from table
    var data = [];
    for (var i = 0; i < table.rows.length; i++) {
        var row = [];
        for (var j = 0; j < table.rows[i].cells.length; j++) {
            row.push(table.rows[i].cells[j].innerText);
        }
        data.push(row);
    }

    // Send data to server
    fetch("/generate-pdf", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ tableData: data })
    })
    .then(response => {
        if (response.ok) {
            // Trigger download of PDF file
            return response.blob();
        } else {
            throw new Error("Failed to generate PDF");
        }
    })
    .then(blob => {
        var url = window.URL.createObjectURL(blob);
        var a = document.createElement("a");
        a.href = url;
        a.download = "table_data.pdf";
        document.body.appendChild(a);
        a.click();
        window.URL.revokeObjectURL(url);
    })
    .catch(error => {
        console.error("Error generating PDF:", error);
    });
}
