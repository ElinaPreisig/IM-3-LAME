document.addEventListener("DOMContentLoaded", function () {
    const toggleSwitches = document.querySelectorAll('input[type="checkbox"]');
    
    toggleSwitches.forEach(function (toggleSwitch) {
        toggleSwitch.addEventListener("change", function () {
            const parent = this.closest('.answer');
            if (this.checked) {
                parent.classList.add('active');
            } else {
                parent.classList.remove('active');
            }
        });
    });

    const confirmButton = document.querySelector('.confirm-button');
    const modal = document.querySelector('.modal');
    const playButton = document.querySelector('.play-button');

    confirmButton.addEventListener('click', function () {
        modal.style.display = 'flex';
    });

    playButton.addEventListener('click', function () {
        modal.style.display = 'none';
    });
});
