document.addEventListener("DOMContentLoaded", function () {
  const datepicker = new Pikaday({
    field: document.getElementById("datepicker"),
    format: "MM/DD/YYYY", // Customize the date format if needed
    showYearDropdown: true, // Enable year dropdown
    yearRange: [1900, moment().year()], // Customize the year range as needed
  });
});
