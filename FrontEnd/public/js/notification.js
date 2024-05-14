// document.addEventListener("DOMContentLoaded", function() {
//     const popup = document.getElementById('popup');

    
//     function getRandomNumber() {
//         return Math.floor(Math.random() * 1000);
//     }

//     // Function to show the popup
//     function showPopup() {
//         const randomNumber = getRandomNumber();
//         const randomNumberElement = document.getElementById('randomNumber');
//         randomNumberElement.textContent = randomNumber;
        
//         popup.classList.add('show');
//         setTimeout(() => {
//             popup.classList.remove('show'); // Hide popup after 3 seconds
//             setTimeout(showPopup, 30000); // Show new popup after 5 seconds
//         }, 3000);
//     }

//     // Initial delay before showing the first popup (5 seconds)
//     setTimeout(showPopup, 10000);
// });
