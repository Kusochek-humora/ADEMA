"use strict"
document.addEventListener('DOMContentLoaded', function () {

    const formLogin = document.querySelector('.login'),
        formReg = document.querySelector('.reg');
    formLogin.addEventListener("click", sendData.bind(null, document.getElementById("login")))
    formReg.addEventListener("click", sendData.bind(null, document.getElementById("reg")))

    function sendData(formElem) {
        // debugger
        // const currentForm = document.getElementById(`${formElem.target.className}`)

        const formData = new FormData(formElem);

        const jsonObject = {};
        function req(route, text, path) {
            fetch(route, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(jsonObject),
            })
                .then(response => response.json())
                .then(data => {
                    console.log(data)
                    if (data.message === "Authentication failed") {
                        alert("не правильные данные")
                    }
                    else {
                        alert(text);
                        window.location = path
                    }

                })
                .catch(error => {
                    console.error('', error);
                    // Дополнительные действия при ошибке регистрации
                });
        }
        formData.forEach((value, key) => {
            jsonObject[key] = value;
        });

        // Отправка запроса в формате JSON
        if (formElem.id === 'reg') {
            console.log('reg')
            req('/users', 'регистрация прошла успешно , пожалуйста авторизуйтесь', '/');
        }
        else if (formElem.id === 'login') {
            console.log('login')
            req('/users/login', 'вы авторизовались', '/menu');
            localStorage.setItem('formData', JSON.stringify(jsonObject));
        }


    }
    // const form = document.getElementById("registrationForm");
    const formsWrapper = document.querySelector('.forms-wrapper')
    const tabs = document.querySelectorAll('.tab');

    formsWrapper.addEventListener('click', function (e) {
        const target = e.target;
        tabs.forEach((item, index) => {
            item.classList.remove('active');
            if (target && target === item) {
                document.querySelectorAll('.form').forEach(el => {
                    el.style.display = "none";

                })
                item.classList.add('active');
                document.querySelectorAll('.form')[index].style.display = "block";
            }
        });

    })
});