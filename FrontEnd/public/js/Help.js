document.addEventListener('DOMContentLoaded', function() {
    const showButton = document.getElementById('showButton');
    const hiddenDiv = document.getElementById('hiddenDiv');

    showButton.addEventListener('click', function() {
        hiddenDiv.style.display = 'block';
    });
});

