document.addEventListener("DOMContentLoaded", function () {
    const datepicker = new Pikaday({
      field: document.getElementById("datepicker"),
      format: "MM/DD/YYYY", // Customize the date format if needed
      showYearDropdown: true, // Enable year dropdown
      yearRange: [1900, moment().year()], // Customize the year range as needed
      onSelect: function (date) {
        const formattedDate = moment(date).format("MM/DD/YYYY");
        window.location.href = window.location.origin + "/transactionhistory2/v1/?date=" + encodeURIComponent(formattedDate);
      },
    });
  });
  
  
  //This is for the 2nd history page, to search by date
  document.getElementById('transaction-date').addEventListener('change', function() {
    var selectedDate = this.value;
    //use selectedDate to fetch and display the transactions for this date
  });
  
  