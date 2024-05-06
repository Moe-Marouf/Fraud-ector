const session = require("express-session");

// Generate a random secret key for session
function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let randomString = '';
    for (let i = 0; i < length; i++) {
        randomString += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return randomString;
}

const secretKey = generateRandomString(32);

// Session middleware setup
const sessionMiddleware = session({
    secret: secretKey,
    resave: false,
    saveUninitialized: false
});


module.exports = { sessionMiddleware, generateAndSendOTP };

// Function to generate and send OTP
function generateAndSendOTP(email, password) {
    // Validate email and password
    if (!validateEmail(email) || !validatePassword(password)) {
        alert("Please enter a valid email and password.");
        return;
    }

    // Authenticate user
    if (!authenticateUser(email, password)) {
        alert("Incorrect email or password. Please try again.");
        return;
    }

    // Generate OTP
    const otp = generateOTP();

    // Send OTP via email
    sendEmailOTP(email, otp);

    // Save OTP to a cookie
    setCookie('savedOTP', otp, 1);

    // Save user session to a cookie
    setCookie('userSession', true, 1);

    alert("Sent OTP");
    countdown(2, 1);
}

// Function to send OTP via email
function sendEmailOTP(email, otp) {
    let emailbody = `<h2>Your OTP is </h2>${otp}`;
    Email.send({
        SecureToken: "4b7b9470-ec71-48df-862a-5e4efb77af8a",
        To: email,
        From: "UserOfFraudector@outlook.com",
        Subject: "OTP",
        Body: emailbody,
    }).then(
        message => {
            console.log("Email send response:", message);
            if (message !== "OK") {
                alert("An error occurred while sending OTP. Please try again later.");
            }
        }
    ).catch(error => {
        console.error("Error sending OTP:", error);
        alert("An error occurred while sending OTP. Please try again later.");
    });
}