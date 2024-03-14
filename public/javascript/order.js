"use strict";
document.addEventListener('DOMContentLoaded', function () {
    const createOrderBtn = document.getElementById("create");
    createOrderBtn.addEventListener('click', createOrder);
    function createOrder() {
        const userName = document.getElementById('userName').value;
        const dishID = document.getElementById('dishID').value;

        const formData = new FormData();
        formData.append('userName', userName);
        formData.append('dishID', dishID);

        fetch('/orders', {
            method: 'POST',
            body: formData,
        })
            .then(response => response.json())
            .then(data => {
                console.log('Order created successfully:', data);
                // Перезагрузить список заказов после создания нового заказа
                // fetchOrders();
                alert('заказ принят!')
            })
            .catch(error => {
                console.error('Error creating order:', error);
            });
    }



})