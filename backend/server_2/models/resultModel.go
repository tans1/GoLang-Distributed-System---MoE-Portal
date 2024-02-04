package models

import "gorm.io/gorm"

type Result struct {
	gorm.Model
	Name string
	Sex string
	Age int64
	AdmissionNumber string `gorm:"unique"`
	Stream string 
	Maths int64 `gorm:"default:0" `
	English int64 `gorm:"default:0" `
	Aptitude int64 `gorm:"default:0" `
	Physics int64 `gorm:"default:0" `
	Chemistry int64 `gorm:"default:0" `
	Biology int64 `gorm:"default:0" `
	// Civic int64 `gorm:"default:0" `
	// Economics int64 `gorm:"default:0" `
	// History int64 `gorm:"default:0" `
	// Geography int64 `gorm:"default:0" `
}