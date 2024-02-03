package main

import (
	database "backendServer1/config"
	"backendServer1/controllers"
	"backendServer1/models"

	"github.com/gin-gonic/gin"
)

type EmptyResponse struct {}

func init() {
	database.ConnectDB()
}

func GetResult(c *gin.Context){
	controllers.GetResult(c)
}
func UploadResult(c *gin.Context){
	token := c.Request.Header.Get("Authorization")
	result, errr := controllers.ValidateToken(token[14:])
	if errr != nil {
		c.JSON(400,controllers.Response{
			Success: false,
			Message: "Invalid token",
			Data: EmptyResponse{},
		})
		return
	}
	
	if !result {
		c.JSON(400,controllers.Response{
			Success: false,
			Message: "Invalid token",
			Data: EmptyResponse{},
		})
		return
	}
	controllers.UploadResult(c)
}
func RegisterUser(c *gin.Context){
	var newUser controllers.NewUser
	if c.BindJSON(&newUser) != nil {
		c.JSON(400,controllers.Response{
			Success: false,
			Message: "Invalid request body",
			Data: EmptyResponse{},
		})
		return
	}
	result, err := controllers.RegisterUser(newUser)
	if err != nil {
		c.JSON(400,controllers.Response{
			Success: false,
			Message: "Invalid request body",
			Data: EmptyResponse{},
		})
	}
	if result {
		c.JSON(200,controllers.Response{
			Success: true,
			Message: "User registered successfully",
			Data: newUser,
		})
	} else {
		c.JSON(500,controllers.Response{
			Success: false,
			Message: "Failed to register user",
			Data: newUser,
		})
	}

	
}
func AuthenticateUser(c *gin.Context){
	var user controllers.User
	if c.BindJSON(&user) != nil {
		c.JSON(400,controllers.Response{
			Success: false,
			Message: "Invalid request body",
			Data:EmptyResponse{},
		})
		return
	}
	result, err := controllers.AuthenticateUser(user)
	if err != nil {
		c.JSON(400,controllers.Response{
			Success: false,
			Message: "Invalid request body",
			Data:EmptyResponse{},
		})
	}
	c.SetCookie("Authorization", result.Token, 3600, "/", "localhost", false, true)
	if result.Token != "" {
		c.JSON(200,controllers.Response{
			Success: true,
			Message: "User logged in successfully",
			Data: result,
		})
	} else {
		c.JSON(500,controllers.Response{
			Success: false,
			Message: "Failed to log in user",
			Data: result,
		})
	}
	
}

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}

func main(){
	database.DB.AutoMigrate(&models.Result{})
	router := gin.Default()
	router.GET("/result",GetResult)
	router.POST("/upload",UploadResult)
	router.POST("/register",RegisterUser)
	router.POST("/login",AuthenticateUser)
	router.Run(":3030")
}