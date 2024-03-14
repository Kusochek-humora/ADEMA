"use strict";
document.addEventListener('DOMContentLoaded', function () {

    const name = JSON.parse(localStorage.getItem('formData'));
    document.getElementById('modal-text').textContent = `${name.login} добро пожаловать !`;

    const nameItem = document.querySelector('.list__item--login');
    nameItem.textContent = `${name.login}`;
    const idItem = document.querySelector('.list__item--id');
    fetch("/users")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(users => {
            users.forEach((item, index) => {
                if (item["login"] === name.login) {
                    idItem.textContent = `Ваш айди: ${item.ID}`
                }

            })

        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });

    const sendBtn = document.getElementById("send_msg");
    sendBtn.addEventListener('click', sendMessage);

    function sendMessage() {
        const message = document.getElementById('message').value;

        const formData = new FormData();
        formData.append('message', message);

        fetch('/send', {
            method: 'POST',
            body: formData,
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Ответ от сервера:', data);
                // Дополнительные действия при успешной отправке сообщения
            })
            .catch(error => {
                console.error('Ошибка при отправке сообщения:', error);
                // Дополнительные действия при ошибке
            });
    }





    const modal_1 = document.getElementById('customModal');
    modal_1.style.display = 'block';

    // Устанавливаем таймер на 3 секунды (3000 миллисекунд)
    setTimeout(function () {
        modal_1.style.display = 'none'; // Закрываем модальное окно
    }, 3000);

    const logout = document.querySelector('.logout');
    logout.addEventListener('click', function (e) {
        e.preventDefault();
        localStorage.clear();
        window.location = "/";
    })


    function fetchDishes() {
        fetch('/dishes')
            .then(response => response.json())
            .then(data => {
                console.log(data)
                // Обработка полученных данных
                displayDishes(data);
            })
            .catch(error => {
                console.error('Error fetching dishes:', error);
            });
    }
    const dishesList = document.getElementById('dishesList');
    // Функция для отображения списка блюд на странице
    function displayDishes(dishes) {
        // Очищаем текущий список блюд
        dishesList.innerHTML = '';
        console.log(dishes)
        // Перебираем блюда и добавляем их в список
        dishes.forEach(function (dish) {
            let { name, description, price, image, ID } = dish;
            const figure = document.createElement('figure');
            figure.classList.add('card');
            figure.innerHTML = `
            <div class="card__image">
                <img src="/upload/${image}" alt="">
            </div>
            <figcaption class="card__descr">
            <p class="card__title">блюдо номер ${ID}</p>
                <p class="card__title">${name}</p>
                <p class="card__text">${description}</p>
                <p class="card__price">${price}</p>
            </figcaption>
           `

            dishesList.appendChild(figure);
        });
    }
    fetchDishes();
})