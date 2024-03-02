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
 // Function to create pie chart based on type data
 function createPieChartType(data) {
    var ctxPieType = document.getElementById("pie-chart-type").getContext("2d");

    // Parse CSV data
    Papa.parse(data, {
        header: true,
        complete: function(results) {
            var typeCounts = {};

            // Count occurrences of each type
            results.data.forEach(function(row) {
                var type = row['type'];
                if (type in typeCounts) {
                    typeCounts[type]++;
                } else {
                    typeCounts[type] = 1;
                }
            });

            // Calculate total transactions
            var totalTransactions = Object.values(typeCounts).reduce((acc, curr) => acc + curr, 0);

            // Calculate percentage values for each type
            var percentages = {};
            Object.keys(typeCounts).forEach(function(type) {
                percentages[type] = ((typeCounts[type] / totalTransactions) * 100).toFixed(2);
            });

            // Extract labels and data values
            var labels = Object.keys(typeCounts);
            var dataValues = Object.values(typeCounts);

            // Create datasets for Chart.js
            var datasets = [{
                backgroundColor: [
                    "rgba(235, 22, 22, .7)",
                    "rgba(235, 22, 22, .6)",
                    "rgba(235, 22, 22, .5)",
                    "rgba(235, 22, 22, .4)",
                    "rgba(235, 22, 22, .3)"
                    // Add more colors as needed
                ],
                data: dataValues
            }];

            // Create the pie chart with percentage values in labels
            var pieChartType = new Chart(ctxPieType, {
                type: "pie",
                data: {
                    labels: labels.map(type => `${type} ${percentages[type]}%`),
                    datasets: datasets
                },
                options: {
                    responsive: true
                }
            });
        }
    });
}

    // Function to create bar chart based on type data
    function createBarChartType(data) {
        var ctxBarType = document.getElementById("bar-chart-type").getContext("2d");

        // Parse CSV data
        Papa.parse(data, {
            header: true,
            complete: function(results) {
                var typeCounts = {};

                // Count occurrences of each type
                results.data.forEach(function(row) {
                    var type = row['type'];
                    if (type in typeCounts) {
                        typeCounts[type]++;
                    } else {
                        typeCounts[type] = 1;
                    }
                });

                // Extract labels and data values
                var labels = Object.keys(typeCounts);
                var dataValues = Object.values(typeCounts);

                // Create datasets for Chart.js
                var datasets = [{
                    backgroundColor: [
                        "rgba(235, 22, 22, .7)",
                        "rgba(54, 162, 235, .7)",
                        // Add more colors as needed
                    ],
                    data: dataValues
                }];

                // Create the bar chart
                var barChartType = new Chart(ctxBarType, {
                    type: "bar",
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        responsive: true
                    }
                });
            }
        });
    }

    // Function to create pie chart based on isFraud data
    function createPieChart(data) {
        var ctxPie = document.getElementById("pie-chart").getContext("2d");

        // Parse CSV data
        Papa.parse(data, {
            header: true,
            complete: function(results) {
                var fraudCounts = {
                    'Fraud': 0,
                    'Not Fraud': 0
                };
    
                // Count occurrences of 'isFraud'
                results.data.forEach(function(row) {
                    if (row['isFraud'] === '1') {
                        fraudCounts['Fraud']++;
                    } else {
                        fraudCounts['Not Fraud']++;
                    }
                });
    
                // Calculate total transactions
                var totalTransactions = Object.values(fraudCounts).reduce((acc, curr) => acc + curr, 0);
    
                // Calculate percentage values
                var percentages = {
                    'Fraud': ((fraudCounts['Fraud'] / totalTransactions) * 100).toFixed(2),
                    'Not Fraud': ((fraudCounts['Not Fraud'] / totalTransactions) * 100).toFixed(2)
                };
    
                // Create datasets for Chart.js
                var datasets = [{
                    backgroundColor: [
                        "rgba(235, 22, 22, .7)",
                        "rgba(54, 162, 235, .7)",
                    ],
                    data: [fraudCounts['Fraud'], fraudCounts['Not Fraud']]
                }];
    
                // Create the pie chart
                var pieChart = new Chart(ctxPie, {
                    type: "pie",
                    data: {
                        labels: [`Fraud ${percentages['Fraud']}%`, `Not Fraud ${percentages['Not Fraud']}%`],
                        datasets: datasets
                    },
                    options: {
                        responsive: true,
                        width: 200, // Specify width
                        height: 200 // Specify height
                    }
                });
            }
        });
    }

    // Function to create bar chart based on isFraud data
    function createBarChart(data) {
        var ctxBar = document.getElementById("bar-chart").getContext("2d");

        // Parse CSV data
        Papa.parse(data, {
            header: true,
            complete: function(results) {
                var labels = ['Fraud', 'Not Fraud'];
                var dataValues = [0, 0];

                // Count occurrences of 'isFraud'
                results.data.forEach(function(row) {
                    if (row['isFraud'] === '1') {
                        dataValues[0]++; // Increment Fraud count
                    } else {
                        dataValues[1]++; // Increment Not Fraud count
                    }
                });

                // Create dataset for Chart.js
                var datasets = [{
                    backgroundColor: [
                        "rgba(235, 22, 22, .7)",
                        "rgba(54, 162, 235, .7)"
                    ],
                    data: dataValues
                }];

                // Create the bar chart
                var barChart = new Chart(ctxBar, {
                    type: "bar",
                    data: {
                        labels: labels,
                        datasets: datasets
                    },
                    options: {
                        responsive: true
                    }
                });
            }
        });
    }
    
  // Function to calculate total fraud
function calculateTotalFraud(data) {
    let totalFraud = 0;
    data.forEach(function(row) {
        if (row['isFraud'] === '1') {
            totalFraud++;
        }
    });
    return totalFraud;
}

// Update the HTML element with the total fraud count
function updateTotalFraudElement(total) {
    const totalFraudElement = document.getElementById('total-fraud');
    totalFraudElement.textContent = total;
}

// Read CSV and calculate total fraud
readCSV('data.csv', function(data) {
    const totalFraud = calculateTotalFraud(data);
    updateTotalFraudElement(totalFraud);
});
  


    // Read CSV and create charts
    readCSV('/js/Data.csv', function(data) {
        populateTable(data)
        createPieChart(data);
        createBarChart(data);
        createPieChartType(data);
        createBarChartType(data);

    });

});