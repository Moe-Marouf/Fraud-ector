// Wait for the DOM content to be fully loaded
document.addEventListener("DOMContentLoaded", function() {
    // Filter the table to display rows where "Fraud or not" is equal to 1
    filterTableByFraudStatus();
});

function filterTableByFraudStatus() {
    var tableRows = document.getElementById("transaction-table2").getElementsByTagName("tbody")[0].getElementsByTagName("tr");

    for (var i = 0; i < tableRows.length; i++) {
        var fraudStatusCell = tableRows[i].querySelector("#fraudStatus");
        if (fraudStatusCell && fraudStatusCell.innerText.trim() !== "1") {
            tableRows[i].style.display = "none"; // Hide the row if Fraud status is not equal to 1
        }
    }
}
