document.getElementById('downloadButton').addEventListener('click', function() {
  // Send a GET request to the server to download data
  fetch('/downloadData')
      .then(response => {
          if (!response.ok) {
              throw new Error('Network response was not ok');
          }
          // Start the download once the response is received
          return response.blob();
      })
      .then(blob => {
          // Create a temporary link element to trigger the download
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = 'data.txt'; // Specify the file name
          document.body.appendChild(a);
          a.click();
          // Cleanup: Remove the temporary link element
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      })
      .catch(error => {
          console.error('Error downloading data:', error);
          // Handle error
      });
});