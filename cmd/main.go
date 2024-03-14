package main

import (
	"github.com/gofiber/fiber/v2"

	"github.com/gofiber/template/html/v2"

	"github.com/divrhino/divrhino-trivia/database"




)

func main() {
	database.ConnectDb()

	engine := html.New("./views", ".html")
	app := fiber.New(fiber.Config{
		Views: engine,
	})

	app.Get("/", func(c *fiber.Ctx) error {
		// Отображаем HTML-страницу с именем "index.html"
		return c.Render("index", fiber.Map{})
	})

	app.Get("/menu", func(c *fiber.Ctx) error {
		// Отображаем HTML-страницу с именем "menu.html"
		return c.Render("menu", fiber.Map{})
	})
	app.Get("/profile", func(c *fiber.Ctx) error {
		// Отображаем HTML-страницу с именем "menu.html"
		return c.Render("profile", fiber.Map{})
	})
	app.Get("/admin", func(c *fiber.Ctx) error {
		// Отображаем HTML-страницу с именем "menu.html"
		return c.Render("admin", fiber.Map{})
	})
	app.Get("/send", func(c *fiber.Ctx) error {
		// Отображаем HTML-страницу с именем "menu.html"
		return c.Render("send", fiber.Map{})
	})
	// Добавьте обработчик для отображения любого HTML-файла по его имени

	setUpRoutes(app)

	app.Static("/", "./public")

	app.Static("/upload", "./upload")

	app.Listen(":3000")




	// Обработчик для отправки сообщения

}
