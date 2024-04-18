document.addEventListener("DOMContentLoaded", function() {
    const popup = document.getElementById('popup');

    // Function to generate a random number
    function getRandomNumber() {
        return Math.floor(Math.random() * 1000); // Generate a random number between 0 and 99
    }

    // Function to show the popup with a random number
    function showPopup() {
        const randomNumber = getRandomNumber();
        const randomNumberElement = document.getElementById('randomNumber');
        randomNumberElement.textContent = randomNumber;
        
        popup.classList.add('show');
        setTimeout(() => {
            popup.classList.remove('show'); // Hide popup after 3 seconds
            setTimeout(showPopup, 5000); // Show new popup after 5 seconds
        }, 3000);
    }

    // Initial delay before showing the first popup (10 seconds)
    setTimeout(showPopup, 5000);
});
