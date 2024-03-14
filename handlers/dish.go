package handlers

import (
	// "os"



	"github.com/divrhino/divrhino-trivia/database"
	"github.com/divrhino/divrhino-trivia/models"
	"github.com/gofiber/fiber/v2"
)

// ListDishes возвращает список всех блюд
func ListDishes(c *fiber.Ctx) error {
	dishes := []models.Dish{}
	database.DB.Db.Find(&dishes)
	return c.JSON(dishes)
}

// CreateDish создает новое блюдо
// func CreateDish(c *fiber.Ctx) error {
// 	dish := new(models.Dish)
// 	if err := c.BodyParser(dish); err != nil {
// 		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
// 	}

//		database.DB.Db.Create(&dish)
//		return c.JSON(dish)
//	}
func CreateDish(c *fiber.Ctx) error {
	dish := new(models.Dish)
	if err := c.BodyParser(dish); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error parsing request",
		})
	}
	file, err := c.FormFile("image")
	if err != nil {

		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
			"message": "Error uploading image",
		})
	}

	// Сохранение изображения в новую директорию "upload"
	err = c.SaveFile(file, "./upload/"+file.Filename)
	if err != nil {

		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": "Error saving image",
		})
	}

	dish.Image = file.Filename

	// Создание блюда
	createResult := database.DB.Db.Create(&dish)
	if createResult.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
			"message": createResult.Error.Error(),
		})
	}

	return c.JSON(dish)
}

// UpdateDish - обновление блюда
// func UpdateDish(c *fiber.Ctx) error {
// 	id := c.Params("id")
// 	dish := models.Dish{}
// 	if err := database.DB.Db.First(&dish, id).Error; err != nil {
// 		return c.Status(fiber.StatusNotFound).JSON(err.Error())
// 	}

// 	if err := c.BodyParser(&dish); err != nil {
// 		return c.Status(fiber.StatusInternalServerError).JSON(err.Error())
// 	}

// 	database.DB.Db.Save(&dish)
// 	return c.JSON(dish)

// }
func UpdateDish(c *fiber.Ctx) error {
    id := c.Params("id")
    dish := models.Dish{}
    if err := database.DB.Db.First(&dish, id).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{
            "message": "Dish not found",
        })
    }

    // Обновляем поля из запроса
    if err := c.BodyParser(&dish); err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "message": "Error parsing request",
            "error":   err.Error(), // Добавляем вывод ошибки
        })
    }

    // Если в запросе есть новое изображение, сохраняем его
    file, err := c.FormFile("image")
    if err == nil {
        // Сохраняем новое изображение
        err := c.SaveFile(file, "./upload/"+file.Filename)
        if err != nil {
            return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
                "message": "Error saving new image",
                "error":   err.Error(), // Добавляем вывод ошибки
            })
        }

        // Обновляем поле Image в модели
        dish.Image = file.Filename
    }

    // Сохраняем изменения в базе данных
    database.DB.Db.Save(&dish)

    return c.JSON(dish)
}







// DeleteDish - удаление блюда
func DeleteDish(c *fiber.Ctx) error {
	id := c.Params("id")
	dish := models.Dish{}
	if err := database.DB.Db.First(&dish, id).Error; err != nil {
		return c.Status(fiber.StatusNotFound).JSON(err.Error())
	}

	database.DB.Db.Delete(&dish)
	return c.SendStatus(fiber.StatusNoContent)
}
