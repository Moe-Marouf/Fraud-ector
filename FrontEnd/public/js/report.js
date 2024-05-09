document.getElementById('downloadButton').addEventListener('click', function() {
    // Send request to server to generate PDF
    fetch('/generatePDF', { method: 'POST' })
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to generate PDF');
            }
            return response.blob();
        })
        .then(blob => {
            // Create a temporary link to download the PDF
            const url = window.URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.style.display = 'none';
            a.href = url;
            a.download = 'report.pdf';
            document.body.appendChild(a);
            a.click();
            window.URL.revokeObjectURL(url);
        })
        .catch(error => {
            console.error('Error:', error);
            alert('Failed to generate PDF');
        });
});
