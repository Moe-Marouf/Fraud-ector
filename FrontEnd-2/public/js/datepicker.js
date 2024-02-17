document.addEventListener("DOMContentLoaded", function () {
  const datepicker = new Pikaday({
    field: document.getElementById("datepicker"),
    format: "MM/DD/YYYY", // Used to customize date format
    showYearDropdown: true, // Enabls year dropdown
    yearRange: [1900, moment().year()], // Used to customize year range

    //Changed the format to make it work with transactionHistory2
    onSelect: function (date) {
      // Format the date to YYYY-MM-DD
      const formattedDate = moment(date).format("YYYY-MM-DD");
      // Following code is related to the url that will be present once the date is chosen
      window.location.href =
        window.location.origin +
        "/transactionhistory2/v1/?date=" +
        encodeURIComponent(formattedDate);
    },
  });
});

//This is for the 2nd history page, to search by date
document
  .getElementById("transaction-date")
  .addEventListener("change", function () {
    var selectedDate = this.value;
    //use selectedDate to fetch and display the transactions for this date
  });
