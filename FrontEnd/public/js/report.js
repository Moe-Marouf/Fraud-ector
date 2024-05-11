document.getElementById("generateReportBtn").addEventListener("click", async () => {
    try {
      const response = await fetch("/generateReport");
      const report = await response.text();
      // Do something with the generated report, such as displaying it to the user
      console.log("Generated report:", report);
    } catch (error) {
      console.error("Error generating report:", error);
    }
  });
  