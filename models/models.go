package models

import "gorm.io/gorm"

type Dish struct {
	gorm.Model
	Name        string `json:"name"`
	Description string `json:"description"`
	Price       string `json:"price"`
    Image       string `json:"image"`
}

type User struct {
	gorm.Model
	Login    string `json:"login" gorm:"unique;not null"`
	Password string `json:"password" gorm:"not null"`
}

type Order struct {
	gorm.Model
	UserID uint
	User   User   `gorm:"foreignKey:UserID"`
	Dishes []Dish `gorm:"many2many:order_dishes;"`
}

type OrderRequestDTO struct {
	UserName string `json:"user_name"`
	DishID   uint   `json:"dish_id"`
}
