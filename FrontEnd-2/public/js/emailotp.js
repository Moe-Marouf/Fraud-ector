emailjs.init("_kDz0wMpArGN7ksvL");

function sendOTP() {
	var params = {
		email: document.getElementById("email").value,
	}
	let otp_val = Math.floor(Math.random() * 10000);
	
	const serviceID = "service_cucc4pm";
	const templateID = "Ytemplate_j34g9xp";
  
	emailjs
		.send(serviceID, templateID, params)
		.then(res=>{
			document.getElementById("otp_val").value = "";
		
			console.log(res);
			alert("Your message sent successfully!!");
		})
		.catch(err=>console.log(err));
  
}
  
  