package controllers

import (
	"net/rpc"
	"time"
)


type User struct {
	Username string
	Password string
}
type NewUser struct {
	User
	Email string
	FirstName string
	LastName  string
}
type LoginResult struct {
	Token string
	ExpireDate time.Time
}



func RegisterUser(newUser NewUser) (bool, error) {
	address, er := GetClient();
	if er != nil {
		return false,er
	}
	client, errr := rpc.Dial("tcp", address)
	if errr != nil {
		return false,errr
	}
	defer client.Close()

	var result bool
	err := client.Call("AuthServer.RegisterUser", newUser, &result)
		if err != nil {
			return false,err
		}
	return result,nil
}
func AuthenticateUser( user User)(LoginResult, error){
	address, er := GetClient();
	if er != nil {
		return  LoginResult{},er
	}
	client, errr := rpc.Dial("tcp", address)
	if errr != nil {
		return  LoginResult{},errr
	}
	defer client.Close()

	var result LoginResult
	err := client.Call("AuthServer.AuthenticateUser", user, &result)
		if err != nil {
			return LoginResult{}, err
		}
	return result,nil
}
func ValidateToken(token string) (bool, error){
	address, er := GetClient();
	if er != nil {
		return false,er
	}
	client, errr := rpc.Dial("tcp", address)
	if errr != nil {
		return false,errr
	}
	defer client.Close()

	var result bool
	err := client.Call("AuthServer.ValidateToken", token, &result)
	if err != nil {
		return result,err
	}

	return result,nil
}


