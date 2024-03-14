"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const modal = document.getElementById('myModal');
    const modal2 = document.getElementById('modal-descr');
    const closeModalBtn = document.getElementById('closeModalBtn');

    const modalText = document.getElementById('modal-text');
    closeModalBtn.addEventListener('click', function () {
        modal.style.display = 'none';

    });

    // Закрываем модальное окно при клике вне его области
    window.addEventListener('click', function (event) {
        if (event.target == modal || event.target==modal2) {
            modal.style.display = 'none';

        }
    });

})
