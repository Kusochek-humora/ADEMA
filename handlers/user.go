package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/divrhino/divrhino-trivia/database"
	"github.com/divrhino/divrhino-trivia/models"
)

func Authenticate(c *fiber.Ctx) error {
	loginInfo := new(models.User)
	if err := c.BodyParser(loginInfo); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error parsing request",
		})
	}

	var user models.User
	result := database.DB.Db.Where("login = ?", loginInfo.Login).Find(&user)
	if result.Error != nil || user.Password != loginInfo.Password || user.Login != loginInfo.Login {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{
			"message": "Authentication failed",
		})
	}

	return c.JSON(user)
}

func CreateUser(c *fiber.Ctx) error {
    user := new(models.User)
    if err := c.BodyParser(user); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "message": "Error parsing request",
        })
    }

    var existingUser models.User
    result := database.DB.Db.Where("login = ?", user.Login).First(&existingUser)
    if result.Error == nil {
        // Пользователь с таким login уже существует
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "message": "User with this login already exists",
        })
    }

    createResult := database.DB.Db.Create(&user)
    if createResult.Error != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "message": createResult.Error.Error(),
        })
    }

	return c.JSON(user)

}

func UpdateUser(c *fiber.Ctx) error {
    id := c.Params("id")

    // Поиск пользователя по ID
    var user models.User
    if err := database.DB.Db.Find(&user, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
    }

    // Обновление данных пользователя
    var updateData models.User
    if err := c.BodyParser(&updateData); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    user.Login = updateData.Login
    user.Password = updateData.Password

    // Сохранение изменений
    database.DB.Db.Save(&user)

    return c.JSON(user)
}

func ListUsers(c *fiber.Ctx) error {
    var users []models.User
    if err := database.DB.Db.Find(&users).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(users)
}
// func renderMenuView(c *fiber.Ctx) error {
// 	return c.Render("menu", fiber.Map{
// 		"Title":    "Меню",
// 	})
// }