document.addEventListener('DOMContentLoaded', () => {
    const burgerButton = document.getElementById('burger-button');
    const sidebar = document.querySelector('.sidebar');

    burgerButton.addEventListener('click', () => {
        sidebar.classList.toggle('open');
    });
});