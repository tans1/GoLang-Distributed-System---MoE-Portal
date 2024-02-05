package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Username string
	Password string
	Email string
	FirstName string
	LastName  string
	Role string `gorm:"default:student" `
}