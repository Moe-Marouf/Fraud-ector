let savedOTP = null;

// Function to set a cookie
function setCookie(name, value, days) {
    const expires = new Date();
    expires.setTime(expires.getTime() + days * 24 * 60 * 60 * 1000);
    document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/`;
}

// Function to get a cookie by name
function getCookie(name) {
    const cookieName = `${name}=`;
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) === 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return null;
}

// Function to send OTP
function sendOTP() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');

    // Dummy validation for email and password (replace with your own validation logic)
    if (!validateEmail(email.value) || !validatePassword(password.value)) {
        alert("Please enter a valid email and password.");
        return;
    }

    // Call authenticateUser function to check if email and password are valid
    if (!authenticateUser(email.value, password.value)) {
        alert("Incorrect email or password. Please try again.");
        return;
    }

    // Generate OTP and save it
    savedOTP = generateOTP();

    // Send OTP via email
    sendEmailOTP(email.value, savedOTP);

    // Save OTP to cookie
    setCookie('savedOTP', savedOTP, 1);

    // Save user session to cookie
    setCookie('userSession', true, 1);

    alert("Sent OTP");
    countdown(2, 1);
}

// Function to verify OTP
function verifyOTP() {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const otp_inp = document.getElementById('otp_inp').value;
    const savedOTP = getCookie('savedOTP');

    // Check if savedOTP is null
    if (!savedOTP) {
        alert("OTP not generated. Please generate OTP first.");
        return;
    }

    // Check if OTP is correct and not expired
    if (otp_inp === savedOTP && getCookie('userSession') === 'true') {
        // Redirect to home page upon successful verification
        window.location.href = "/home/v1/";
    } else if (!authenticateUser(email, password)) {
        alert("Incorrect email or password. Please try again.");
    } else {
        alert("Invalid OTP or OTP expired. Please try again.");
    }
}

// Function to generate OTP
function generateOTP() {
    return Math.floor(Math.random() * 10000);
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

// Function to validate email format
function validateEmail(email) {
    const re = /\S+@\S+\.\S+/;
    return re.test(email);
}

// Function to validate password (dummy example, replace with your own validation logic)
function validatePassword(password) {
    return password.length >= 1; // Minimum 8 characters
}

const users = [
    { email: "218110207@psu.edu.sa", password: "1" },
    { email: "220110431@psu.edu.sa", password: "1" },
    { email: "220110081@psu.edu.sa", password: "1" },
    { email: "218110172@psu.edu.sa", password: "1" },
];

// Dummy function to authenticate user (replace with your own authentication logic)
function authenticateUser(email, password) {
    // Check if the provided email and password match any user in the array
    return users.some(user => user.email === email && user.password === password);
}
