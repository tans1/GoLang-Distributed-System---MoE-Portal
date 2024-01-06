package main

import (
	"backendServer1/controllers"
	"backendServer1/models"
	database "backendServer1/config"

	"github.com/gin-gonic/gin"
)

func init() {
	database.ConnectDB()
}

func handleRequest(c *gin.Context){
	method := c.Request.Method
	if method == "GET" {
		controllers.GetResult(c)
	} else if method == "POST" {
		controllers.UploadResult(c)
	}
}

func main(){
	database.DB.AutoMigrate(&models.Result{})
	router := gin.Default()
	router.Any("/backend",handleRequest)
	router.Run(":3030")
}