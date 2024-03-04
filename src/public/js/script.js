const notificationContainer = document.querySelector('.container');

if (notificationContainer !== null) {
    setTimeout(() => {
        notificationContainer.classList.add('hide');
    }, 5000);
    setTimeout(() => {
        notificationContainer.remove();
    }, 5600);
}

function changePageSize(selectElement, currentPage) {
    const selectedPageSize = selectElement.value;
    window.location.href = `/patients/?currentPage=${currentPage || 1}&pageSize=${selectedPageSize}`;
}
