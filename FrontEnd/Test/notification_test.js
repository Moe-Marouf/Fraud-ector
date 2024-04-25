class PopupTester {
    constructor() {
        this.popup = document.createElement('div');
        this.popup.id = 'popup';
        this.randomNumberElement = document.createElement('span');
        this.randomNumberElement.id = 'randomNumber';
        this.popup.appendChild(this.randomNumberElement);
        document.body.appendChild(this.popup);

        this.popupVisible = false;
    }

    getRandomNumber() {
        return Math.floor(Math.random() * 1000);
    }

    showPopup() {
        const randomNumber = this.getRandomNumber();
        this.randomNumberElement.textContent = randomNumber;
        
        this.popup.classList.add('show');
        this.popupVisible = true;

        setTimeout(() => {
            this.popup.classList.remove('show'); // Hide popup after 3 seconds
            this.popupVisible = false;

            setTimeout(() => {
                if (!this.popupVisible) {
                    this.showPopup(); // Show new popup after 5 seconds if current popup is hidden
                }
            }, 5000);
        }, 3000);
    }

    startTest() {
        // Simulate DOMContentLoaded event
        document.dispatchEvent(new Event('DOMContentLoaded'));

        // Test initial popup appearance
        setTimeout(() => {
            console.log('Initial popup should appear now');
            this.showPopup();

            // Test popup disappearance after 3 seconds
            setTimeout(() => {
                console.log('Initial popup should be hidden now');
                // Test new popup appearance after 5 seconds
                setTimeout(() => {
                    console.log('New popup should appear now');
                    this.showPopup();
                }, 5000);
            }, 3000);
        }, 5000);
    }
}

// Usage:
const tester = new PopupTester();
tester.startTest();
