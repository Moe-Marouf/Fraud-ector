
//comment down 
function sendComment(email, name, comment) {
    let emailbody = `
        <h2>New Comment from ${name}</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Comment:</strong> ${comment}</p>
    `;

    Email.send({
        SecureToken: "4b7b9470-ec71-48df-862a-5e4efb77af8a",
        To: "218110207@psu.edu.sa",
        From: "UserOfFraudector@outlook.com",
        Subject: "New Comment",
        Body: emailbody,
    }).then(
        message => {
            console.log("Email send response:", message);
            if (message !== "OK") {
                alert("An error occurred while sending the comment. Please try again later.");
            } else {
                alert("Comment sent successfully!");
            }
        }
    ).catch(error => {
        console.error("Error sending comment:", error);
        alert("An error occurred while sending the comment. Please try again later.");
    });
}

document.addEventListener("DOMContentLoaded", function() {
    const showButton = document.getElementById("showButton");

    showButton.addEventListener("click", function() {
        const email = document.getElementById("emailInput").value;
        const name = document.getElementById("nameInput").value;
        const comment = document.getElementById("commentInput").value;

        // Validate email, name, and comment before sending
        if (email && name && comment) {
            sendComment(email, name, comment);
        } else {
            alert("Please fill in all fields before sending.");
        }
    });
});
