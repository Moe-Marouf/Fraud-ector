function sendOTP() {
	const email = document.getElementById('email');
	const otpverify = document.getElementsByClassName('otpverify')[0];

	let otp_val = Math.floor(Math.random() * 10000);

	let emailbody = `<h2>Your OTP is </h2>${otp_val}`;
	Email.send({
    SecureToken : "9ed499ba-d073-4618-9bbe-ebd6fa693cfb",
    To : email.value,
    From : "218110207@psu.edu.sa",
    Subject : "Email OTP using JavaScript",
    Body : emailbody,
}).then(

	message => {
		if (message === "OK") {
			alert("OTP sent to your email " + email.value);

			otpverify.style.display = "flex";
			const otp_inp = document.getElementById('otp_inp');
			const otp_btn = document.getElementById('otp-btn');

			otp_btn.addEventListener('click', () => {
				if (otp_inp.value == otp_val) {
					alert("Email address verified...");
				}
				else {
					alert("Invalid OTP");
				}
			})
		}
	}
);
}
    function validateAndRedirect() {
        const email = document.getElementById('email').value;
        const password = document.getElementById('floatingPassword').value;
        const otp = document.getElementById('otp_inp').value;

        // You should implement your own validation logic for email, password, and OTP
        // For demonstration purposes, I'm assuming they are correct if they are not empty
        if (email.trim() !== '' && password.trim() !== '' && otp.trim() !== '') {
            // Redirect to /home/v1/
            window.location.href = '/home/v1/';
        } else {
            alert('Please fill in all fields correctly.');
        }
    }

