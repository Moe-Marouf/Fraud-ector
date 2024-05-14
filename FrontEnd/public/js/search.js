function searchTable() {
    // Retrieve search queries from input fields
    var searchNumber = document.getElementById('searchNumber').value.toLowerCase();
    var searchNameOrig = document.getElementById('searchNameOrig').value.toLowerCase();
    var searchNameDest = document.getElementById('searchNameDest').value.toLowerCase();
    var searchAmount = document.getElementById('searchAmount').value.toLowerCase();
    var searchFraud = document.getElementById('searchFraud').value.toLowerCase();

    // Get all rows of the table except the header row
    var rows = document.getElementById('transaction-table2').getElementsByTagName('tbody')[0].getElementsByTagName('tr');

    // Iterate through each row
    for (var i = 0; i < rows.length; i++) {
        var row = rows[i];
        var cells = row.getElementsByTagName('td');
        var match = true;

        // Check if any cell in the row matches the search query
        if (searchNumber && !cells[0].innerText.toLowerCase().includes(searchNumber)) {
            match = false;
        }
        if (searchNameOrig && !cells[1].innerText.toLowerCase().includes(searchNameOrig)) {
            match = false;
        }
        if (searchNameDest && !cells[2].innerText.toLowerCase().includes(searchNameDest)) {
            match = false;
        }
        if (searchAmount && !cells[3].innerText.toLowerCase().includes(searchAmount)) {
            match = false;
        }
        if (searchFraud && !cells[4].innerText.toLowerCase().includes(searchFraud)) {
            match = false;
        }

        // Show/hide row based on whether it matches the search query
        if (match) {
            row.style.display = '';
        } else {
            row.style.display = 'none';
        }
    }
}