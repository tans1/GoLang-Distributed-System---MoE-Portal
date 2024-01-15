package main

import (
	database "authServer1/config"
	"authServer1/controller"
	models "authServer1/model"
	"net"
	"net/rpc"
)

type AuthServer int


func init(){
	database.ConnectDB()
}
func (c *AuthServer) RefreshToken(token *string, result *controller.LoginResult) error {
	loginResult, err := controller.Refresh(*token)
	if err != nil {
		return err
	}

	*result = loginResult
	return nil
}
func (c *AuthServer) ValidateToken(token *string, result *bool) error {
	*result = controller.ValidateToken(*token)
	return nil
}
func (c *AuthServer) RegisterUser(newUser *controller.NewUser, result *bool) error {
	*result = controller.RegisterUser(*newUser)
	return nil
}
func (c *AuthServer) AuthenticateUser(user *controller.User, result *controller.LoginResult) error {
	loginResult, err := controller.Login(*user)
	if err != nil {
		return err
	}

	*result = loginResult
	return nil
}


func main() {
	database.DB.AutoMigrate(&models.User{})
	authServer := new(AuthServer)
	rpc.Register(authServer)

	listener, err := net.Listen("tcp", ":8001")
	if err != nil {
		return
	}

	for {
		conn, err := listener.Accept()
		if err != nil {
			continue
		}
		go rpc.ServeConn(conn)
	}
}
