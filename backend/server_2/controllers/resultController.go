package controllers

import (
	database "backendServer1/config"
	"backendServer1/models"

	"github.com/gin-gonic/gin"
)

type Base struct {
	Latitude  float64         `json:"latitude"`
    Longitude float64         `json:"longitude"`
	Token string  `json:"token"`
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

type ResponseData struct {
	Name string
	Sex string
	Age int64
	Stream string 
	Maths int64 
	English int64 
	Aptitude int64 
	Physics int64 
	Chemistry int64 
	Biology int64
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
	token := body.Token
	rst , _ := ValidateToken(token)
	if !rst {

		c.JSON(400,Response{
			Success: false,
			Message: "Invalid token",
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
	paramName := c.Query("admissionNumber");
	var result models.Result
	database.DB.Where("admission_number = ?", paramName).First(&result)
	if result.ID == 0 {
		c.JSON(404, Response{
			Success: false,
			Message: "Result not found",
			Data: models.Result{},
		})
		return
	}
	
	responseData := ResponseData{
		Name:      result.Name,
		Sex:       result.Sex,
		Age:       result.Age,
		Stream:    result.Stream,
		Maths:     result.Maths,
		English:   result.English,
		Aptitude:  result.Aptitude,
		Physics:   result.Physics,
		Chemistry: result.Chemistry,
		Biology:   result.Biology,
	}
	c.JSON(200, Response{
		Success: true,
		Message: "Result found",
		Data: responseData,
	})
}