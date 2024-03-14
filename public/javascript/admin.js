"use strict";
document.addEventListener('DOMContentLoaded', function () {

    fetch("/users")
        .then(response => {
            if (!response.ok) {
                throw new Error(`Network response was not ok: ${response.statusText}`);
            }
            return response.json();
        })
        .then(users => {
            // Display the list of users
            displayUserList(users);
        })
        .catch(error => {
            console.error("Error fetching data:", error);
        });


    function displayUserList(users) {
        const userListElement = document.getElementById("userList");
        userListElement.classList.add('userList')
        console.log(users);
        // Clear any existing content
        userListElement.innerHTML = "";

        // Create list items for each user and append to the list
        users.forEach(user => {
            const listItem = document.createElement("li");
            listItem.classList.add('item-user')
            let text = document.createElement("p");
            text.classList.add('text_user');
            text.textContent = `${user.ID}: ${user.login}`;

            // let deleteBtn = document.createElement('button');
            // deleteBtn.setAttribute("type", "button");
            // deleteBtn.setAttribute("data-id", `${user.ID}`)
            // deleteBtn.textContent = "Удалить";
            // deleteBtn.classList.add('button', 'delete-user')
            listItem.append(text)
            // listItem.append(deleteBtn);
            userListElement.appendChild(listItem);
        });
    }
    const formDish = document.querySelector('.dish-form');
    // const formDish = document.querySelector('.dish-form');
    formDish.addEventListener("submit", function (event) {
        event.preventDefault();

        createDish(formDish);
    });

    function createDish(formElem) {
        const formData = new FormData(formElem);
        console.log(formData)
        fetch('/dishes', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Response from server:', data);
                // Дополнительные действия при успешном ответе от сервера
                fetchDishes();
            })
            .catch(error => {
                console.error('Error:', error);
                // Дополнительные действия при ошибке
            })
    }

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
                <button type="button" class="delete" data-id="${ID}">Удалить</button>
                <button type="button" class="update" data-id="${ID}">Изменить</button>
            </figcaption>
           `

            dishesList.appendChild(figure);
        });
    }

    // Вызываем функцию получения блюд при загрузке страницы
    fetchDishes();


    dishesList.addEventListener('click', deleteDishesHandler)
    function deleteDishesHandler(e) {
        const deleteDishesBtn = document.querySelectorAll('.delete');
        const target = e.target;

        deleteDishesBtn.forEach((item, index) => {
            if (target && target === item) {

                if (confirm('Вы уверены, что хотите удалить блюдо?')) {
                    // Отправляем запрос на удаление
                    fetch(`/dishes/${item.dataset.id}`, {
                        method: 'DELETE',
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error(`HTTP error! Status: ${response.status}`);
                            }
                            // return response.json();
                        })
                        .then(data => {
                            console.log('Deleted successfully:', data);
                            fetchDishes();
                        })
                        .catch(error => {
                            console.error('Error deleting:', error);
                            // Дополнительные действия при ошибке удаления
                        });
                }
            }
        })
    }
    dishesList.addEventListener('click', updateDataHandler);
    function updateDataHandler(e) {
        const updateDishesBtn = document.querySelectorAll('.update');
        const target = e.target;
        updateDishesBtn.forEach((item, index) => {
            if (target && target === item) {
                document.getElementById('myModal').style.display = 'block';
                document.getElementById('updateButton').setAttribute('data-update-id', `${item.dataset.id}`)
            }
        })

    }
    document.getElementById('closeModalButton').addEventListener('click', function () {
        document.getElementById('myModal').style.display = 'none';
    });

    // Также закрываем модальное окно при клике вне формы
    window.addEventListener('click', function (event) {
        const modal = document.getElementById('myModal');
        if (event.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Добавляем обработчик на кнопку "Обновить блюдо"
    document.getElementById('updateButton').addEventListener('click', function (e) {

        // Получаем данные из формы и отправляем запрос на обновление
        // ...
        const updateData = {
            name: document.getElementById('updateName').value,
            description: document.getElementById('updateDescription').value,
            price: document.getElementById('updatePrice').value,
            image: document.getElementById('updateImage').files[0]
        };
        const formData = new FormData();
        console.log(updateData)

        formData.append('image', updateData.image);
        formData.append('name', updateData.name);
        formData.append('description', updateData.description);
        formData.append('price', updateData.price);

        // Получаем выбранный файл из инпута


        console.log(e.target.dataset.updateId)
        fetch(`/dishes/${e.target.dataset.updateId}`, {
            method: 'PATCH',
            body: formData,  // Используем FormData вместо JSON.stringify
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Updated successfully:', data);
                fetchDishes();
            })
            .catch(error => {
                console.error('Error updating:', error);
                // Дополнительные действия при ошибке обновления
            });
        // После успешного обновления закрываем модальное окно
        document.getElementById('myModal').style.display = 'none';
    });




    // Функция для получения списка всех заказов
    function fetchOrders() {
        fetch('/orders')
            .then(response => response.json())
            .then(data => {
                displayOrders(data);
                console.log(data, '12')
            })
            .catch(error => {
                console.error('Error fetching orders:', error);
            });
    }
    const orderList = document.getElementById('orderList');
    // Функция для отображения списка заказов на веб-странице
    function displayOrders(orders) {

        orderList.innerHTML = '';

        orders.forEach(order => {
            console.log(order)

            const listItem = document.createElement('li');
            listItem.innerHTML = `<h3 class="subtitle">Заказ номер : ${order.ID}</h3> <p class="text-order"><br> Пользователь <b>${order.User.login}</b>  <br> с ID: <b>${order.UserID}</b>, <br> заказал блюдо ID : <b>${order.Dishes[0].ID}</b> , <br> название : <b>${order.Dishes[0].name} </b>, 
            цена : <b>${order.Dishes[0].price}</b></p> <br> <button class="order-btn delete" style="margin-bottom:25px;margin-top:10px;" type="button" data-order-id="${order.ID}">Удалить заказ</button> <br>
            <button class="descr-order" style="margin-bottom:25px;margin-top:10px;" type="button" data-order-id="${order.ID}">Узнать описание</button>`;
            orderList.appendChild(listItem);


        });
    }

    orderList.addEventListener('click', function (e) {
        const target = e.target;
        const deleteOrderBtn = document.querySelectorAll('.order-btn');
        deleteOrderBtn.forEach((item, index) => {
            console.log(item)
            if (target && target === item) {
                console.log('123')
                deleteOrder(item.dataset.orderId);
            }
        });

        const getOrderBtn = document.querySelectorAll('.descr-order');
        getOrderBtn.forEach((item, index) => {
            console.log(item)
            if (target && target === item) {
                console.log('123')
                getOrder(item.dataset.orderId);
            }
        });
    })
    function deleteOrder(orderId) {



        fetch(`/orders/${orderId}`, {
            method: 'DELETE',

        })
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                // return response.json();
            })
            .then(data => {
                console.log('Order deleted successfully:', data);
                // Дополнительные действия при успешном удалении заказа
            })
            .catch(error => {
                console.error('Error deleting order:', error);
                // Дополнительные действия при ошибке удаления
            });
    }
    function getOrder(orderId) {
        const modalText = document.getElementById('modal-text-descr');

        fetch(`/orders/${orderId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('Order info:', data);
                // data.forEach(item => {
                //     
                // })
                const p = document.createElement('p');

                const price = document.createElement('p');
                price.textContent = `Цена : ${data.Dishes[0].price}`;
                const img = document.createElement('img');
                img.classList.add('desrc-img')
                img.src = `/upload/${data.Dishes[0].image}`
                p.textContent = `Описание : ${data.Dishes[0].description}`;
                document.getElementById('modal-descr').style.display = 'block';
                // const btn = document.createElement('button');
                // btn.id = 'close-descr';
                // btn.setAttribute("type", "button");
                // btn.textContent = "Закрыть"
                // modalText.prepend(btn)
                modalText.prepend(p)
                modalText.prepend(price)
                modalText.prepend(img)
            })
            .catch(error => {
                console.error('Error getting order:', error);
                // Дополнительные действия при ошибке получения заказа
            });
    }

    const modal2 = document.getElementById('modal-descr');

    const closeModalBtn2 = document.getElementById("close-descr")


    closeModalBtn2.addEventListener('click', function () {
        modal2.style.display = 'none';
        resetDescr()
    });
    // Закрываем модальное окно при клике вне его области
    window.addEventListener('click', function (event) {
        if (event.target == modal2) {
            resetDescr()
            modal2.style.display = 'none';
        }
    });

    function resetDescr() {
        document.getElementById('modal-text-descr').innerHTML = ``;
    }
    // Функция для поиска заказов
    // function findOrders() {
    //     const searchTerm = document.getElementById('searchTerm').value;

    //     fetch(`/orders/search?term=${searchTerm}`)
    //         .then(response => response.json())
    //         .then(data => {
    //             displayFoundOrders(data);
    //         })
    //         .catch(error => {
    //             console.error('Error finding orders:', error);
    //         });
    // }
    // const findBtn = document.querySelector('#find');
    // findBtn.addEventListener('click', findOrders)
    // const create = document.querySelector('#create');
    // create.addEventListener('click', createOrder)
    // // Функция для отображения найденных заказов
    // function displayFoundOrders(foundOrders) {
    //     const foundOrdersList = document.getElementById('foundOrdersList');
    //     foundOrdersList.innerHTML = '';

    //     foundOrders.forEach(order => {
    //         const listItem = document.createElement('li');
    //         listItem.textContent = `Order ID: ${order.id}, User: ${order.user_name}, Dish: ${order.dish_name}`;
    //         foundOrdersList.appendChild(listItem);
    //     });
    // }

    // Запуск загрузки списка заказов при загрузке страницы

    fetchOrders();
    // Функция для отправки запроса на сервер и обновления результатов поиска
    // async function searchOrders() {
    //     const searchInput = document.getElementById('searchInput');
    //     const searchResults = document.getElementById('searchResults');

    //     // Получаем значение из поля поиска
    //     const query = searchInput.value;

    //     // Отправляем запрос на сервер, используя Fetch API
    //     const response = await fetch(`/orders/search:${query}`);
    //     const data = await response.json();

    //     // Очищаем результаты поиска
    //     searchResults.innerHTML = '';

    //     // Обрабатываем результаты и добавляем их на страницу
    //     if (data.length > 0) {
    //         console.log(data)
    //         data.forEach(order => {
    //             const orderElement = document.createElement('div');
    //             orderElement.innerHTML = `
    //       <p>Order ID: ${order.order_id}</p>
    //       <p>User Name: ${order.user_name}</p>
    //       <p>Dish Name: ${order.dish_name}</p>
    //       <hr>
    //     `;
    //             searchResults.appendChild(orderElement);
    //         });
    //     } else {
    //         // Если результатов нет, показываем сообщение
    //         searchResults.innerHTML = 'Ничего не найдено';
    //     }
    // }

    // Добавляем обработчик события для автоматического поиска при вводе
    // const searchBtn = document.getElementById('search');
    // searchBtn.addEventListener('click', searchOrders);

})