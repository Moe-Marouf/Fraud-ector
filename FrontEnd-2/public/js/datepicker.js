document.addEventListener("DOMContentLoaded", function () {
    const datepicker = new Pikaday({
      field: document.getElementById("datepicker"),
      format: "MM/DD/YYYY", // Customize the date format if needed
      showYearDropdown: true, // Enable year dropdown
      yearRange: [1900, moment().year()], // Customize the year range as needed

      //Changed the format to make it work with transactionHistory2
      onSelect: function (date) {
        // Format the date to YYYY-MM-DD
        const formattedDate = moment(date).format("YYYY-MM-DD");
        window.location.href = window.location.origin + "/transactionhistory2/v1/?date=" + encodeURIComponent(formattedDate);
      },
    });
  });

  
  
  
  //This is for the 2nd history page, to search by date
  document.getElementById('transaction-date').addEventListener('change', function() {
    var selectedDate = this.value;
    //use selectedDate to fetch and display the transactions for this date
  });
  
  