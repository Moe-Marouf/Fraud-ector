document.addEventListener('DOMContentLoaded', function() {
    // Function to read CSV file
    function readCSV(url, callback) {
        fetch(url)
            .then(response => response.text())
            .then(callback);
    }

    // Function to populate the table with data
    function populateTable(data) {
        var tableBody = document.querySelector("#transaction-table tbody");
        tableBody.innerHTML = ""; // Clear existing rows

        // Parse CSV data
        Papa.parse(data, {
            header: true,
            complete: function(results) {
                results.data.forEach(function(row, index) {
                    // Create a new row in the table
                    var newRow = document.createElement("tr");
                    newRow.innerHTML = `
                        <td>${index + 1}</td>
                        <td>${row['nameOrig']}</td>
                        <td>${row['type']}</td>
                        <td>${row['amount']}</td>
                        <td>${row['oldbalanceOrg']}</td>
                        <td>${row['newbalanceOrig']}</td>
                        <td>${row['nameDest']}</td>
                        <td>${row['isFraud']}</td>
                    `;
                    tableBody.appendChild(newRow);
                });
            }
        });
    }

 
  


    // Read CSV and create charts
    readCSV('data.csv', function(data) {
        populateTable(data)

    });

});