package handlers

import (
	"github.com/gofiber/fiber/v2"
	"github.com/divrhino/divrhino-trivia/database"
	"github.com/divrhino/divrhino-trivia/models"
	"strconv"
    "gorm.io/gorm"
)

func ListOrders(c *fiber.Ctx) error {
    var orders []models.Order
    // Загрузка заказов вместе с связанными пользователями и блюдами
    if err := database.DB.Db.Preload("User").Preload("Dishes").Find(&orders).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(orders)
}


// CreateOrder - создание нового заказа
func CreateOrder(c *fiber.Ctx) error {
    dto := new(models.OrderRequestDTO)
    if err := c.BodyParser(dto); err != nil {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": err.Error()})
    }

    // Найдите пользователя по имени (предполагая, что у вас есть такая функциональность)
    var user models.User
    if err := database.DB.Db.Where("login = ?", dto.UserName).First(&user).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "User not found"})
    }

    // Найдите блюдо по ID
    var dish models.Dish
    if err := database.DB.Db.First(&dish, dto.DishID).Error; err != nil {
        return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"error": "Dish not found"})
    }

    // Создайте заказ
    order := models.Order{
        UserID: user.ID,
        Dishes: []models.Dish{dish},
    }
    database.DB.Db.Create(&order)

    // Возвращаем информацию о заказе
    return c.JSON(fiber.Map{
        "order_id":   order.ID,
        "user_name":  user.Login,
        "dish_name":  dish.Name,
    })
}



// GetOrder - получение информации о заказе по ID
func GetOrder(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	order := models.Order{}
	database.DB.Db.Preload("Dishes").First(&order, id)
	return c.JSON(order)
}

// DeleteOrder - удаление заказа
func DeleteOrder(c *fiber.Ctx) error {
	id, err := strconv.Atoi(c.Params("id"))
	if err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(err.Error())
	}

	order := models.Order{}
	database.DB.Db.Delete(&order, id)
	return c.SendStatus(fiber.StatusNoContent)
}

// FindOrders - поиск заказов по ID пользователя
func FindOrders(c *fiber.Ctx) error {
    query := c.Query("query")

    if query == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"error": "Query parameter is required"})
    }

    var orders []models.Order
    database := c.Locals("db").(*gorm.DB)

    // Изменено условие поиска на основе вашего запроса
    if err := database.Where("user_name LIKE ?", "%"+query+"%").Preload("Dishes").Find(&orders).Error; err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"error": err.Error()})
    }

    return c.JSON(orders)
}
