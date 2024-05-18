document.addEventListener("DOMContentLoaded", function() {
    const showButton = document.getElementById("showButton");

    showButton.addEventListener("click", function() {
        const email = document.getElementById("emailInput").value;
        const name = document.getElementById("nameInput").value;
        const comment = document.getElementById("commentInput").value;

        // Validate email, name, and comment before sending
        if (email && name && comment) {
            fetch('/sendComment', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, name, comment }),
            })
            .then(response => {
                if (response.ok) {
                    alert("Comment sent successfully!");
                    document.getElementById("emailInput").value = "";
                    document.getElementById("nameInput").value = "";
                    document.getElementById("commentInput").value = "";
                } else {
                    throw new Error('Failed to send comment');
                }
            })
            .catch(error => {
                console.error("Error sending comment:", error);
                alert("An error occurred while sending the comment. Please try again later.");
            });
        } else {
            alert("Please fill in all fields before sending.");
        }
    });
});
