const notificationContainer = document.querySelector('.container');

if (notificationContainer !== null) {
    setTimeout(() => {
        notificationContainer.classList.add('hide');
    }, 5000);
    setTimeout(() => {
        notificationContainer.remove();
    }, 5600);
}