package controllers

import (
	database "backendServer2/config"
	"backendServer2/models"
	"github.com/gin-gonic/gin"
)

type Base struct {
	Latitude  float64         `json:"latitude"`
    Longitude float64         `json:"longitude"`
}

type Body struct {
	Base
    Data      []models.Result `json:"data"`
}

type Body2 struct {
    Base
	AdmissionNumber      string `json:"admissionNumber"`
}

type Response struct {
	Success bool
	Message string 
	Data interface{}
}

func UploadResult(c *gin.Context){
	var body Body
	if c.BindJSON(&body) != nil {
        c.JSON(400, Response{
			Success: false,
			Message: "Invalid request body",
			Data: models.Result{},
		})
        return
    }
	result := database.DB.Create(&body.Data)
	if result.Error != nil {
		c.JSON(500, Response{
			Success: false,
			Message: "Failed to upload result",
			Data: models.Result{},
		})
	} else {
		c.JSON(200, Response{
			Success: true,
			Message: "Result uploaded successfully",
			Data: body.Data,
		})
	
	}
}

func GetResult(c *gin.Context){
	var body Body2
	var result models.Result
	if c.BindJSON(&body) != nil {
		c.JSON(400, Response{
			Success: false,
			Message: "Invalid request body",
			Data: models.Result{},
		})
		return
	}
	database.DB.Where("admission_number = ?", body.AdmissionNumber).First(&result)
	if result.ID == 0 {
		c.JSON(404, Response{
			Success: false,
			Message: "Result not found",
			Data: models.Result{},
		})
		return
	}
	c.JSON(200, Response{
		Success: true,
		Message: "Result found",
		Data: result,
	})
}