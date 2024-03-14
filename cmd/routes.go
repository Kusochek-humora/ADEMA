package main

import (
	"log"
	"net/http"

	"github.com/divrhino/divrhino-trivia/handlers"
	tgbotapi "github.com/go-telegram-bot-api/telegram-bot-api"
	"github.com/gofiber/fiber/v2"
)

func setUpRoutes(app *fiber.App) {

	// Маршруты для управления блюдами
	app.Get("/dishes", handlers.ListDishes)        // Получить список всех блюд
	app.Post("/dishes", handlers.CreateDish)       // Создать новое блюдо
	app.Patch("/dishes/:id", handlers.UpdateDish)  // Обновить блюдо по ID
	app.Delete("/dishes/:id", handlers.DeleteDish) // Удалить блюдо по ID

	// Маршруты для управления заказами
	app.Get("/orders", handlers.ListOrders)         // Получить список всех заказов
	app.Post("/orders", handlers.CreateOrder)       // Создать новый заказ
	app.Get("/orders/:id", handlers.GetOrder)       // Получить информацию о заказе по ID
	app.Delete("/orders/:id", handlers.DeleteOrder) // Удалить заказ по ID
	// app.Get("/orders/search", handlers.FindOrders)  // Поиск заказа

	// Маршруты для авторизаций
	app.Post("/users", handlers.CreateUser)         // Регистрация
	app.Post("/users/login", handlers.Authenticate) // Вход
	// app.Put("/users/:id", handlers.UpdateUser)
	app.Get("/users", handlers.ListUsers)

	// Инициализация бота с использованием токена вашего телеграм-бота
	bot, err := tgbotapi.NewBotAPI("6778149008:AAF979_JEhX3LxlDMSXB0CJ02Afmqy-l41U")
	if err != nil {
		log.Panic(err)
	}

	app.Post("/send", func(c *fiber.Ctx) error {
		// Чтение текста сообщения из формы
		message := c.FormValue("message")

		// ID чата, куда будет отправлено сообщение
		chatID := int64(631863098)

		// Создание сообщения для отправки
		msg := tgbotapi.NewMessage(chatID, message)

		// Отправка сообщения
		_, err := bot.Send(msg)
		if err != nil {
			log.Println(err)
			return c.Status(http.StatusInternalServerError).JSON(fiber.Map{"error": "Error sending message"})
		}

		return c.JSON(fiber.Map{"status": "success", "message": "Message sent"})
	})

}
