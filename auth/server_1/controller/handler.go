package controller

import (
	database "authServer1/config"
	models "authServer1/model"
	"fmt"
	"time"

	"github.com/dgrijalva/jwt-go"
	"golang.org/x/crypto/bcrypt"
)
var jwtKey = []byte("secret_key")
type User struct {
	Username string
	Password string
}
type NewUser struct {
	User
	Email string

}
type Claims struct {
	Username string `json:"username"`
	jwt.StandardClaims
}

func RegisterUser(credentials NewUser) bool {
	fmt.Println("Inside the register function ")

	hashedPassword, err := bcrypt.GenerateFromPassword([]byte(credentials.Password), bcrypt.DefaultCost)
	if err != nil {
		return false
	}
	result := database.DB.Create(
		&models.User{
			Username: credentials.Username,
			Password: string(hashedPassword),
			Email: credentials.Email,
		},
	)

	return result.Error == nil
}

type LoginResult struct {
	Token string
	ExpireDate time.Time
}
func Login(credentials User) (LoginResult, error) {
	expectedPassword, err := getUserPassword(credentials.Username)
	if err != nil {
		return LoginResult{}, err
	}

	err = bcrypt.CompareHashAndPassword([]byte(expectedPassword), []byte(credentials.Password))
	if err != nil {
		return LoginResult{}, err
	}

	expirationTime := time.Now().Add(time.Minute * 5)
	claims := &Claims{
		Username: credentials.Username,
		StandardClaims: jwt.StandardClaims{
			ExpiresAt: expirationTime.Unix(),
		},
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		return LoginResult{}, err
	}

	return LoginResult{
		Token:      tokenString,
		ExpireDate: expirationTime,
	}, nil
}

func ValidateToken(token string) bool {
	claims := &Claims{}
	tkn, err := jwt.ParseWithClaims(token, claims,
		func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})
	
		
	if err != nil {
		fmt.Println("invalid", err, tkn)
		if err == jwt.ErrSignatureInvalid {
			fmt.Println("Err Signature")
			return false
		}
		return false
	}

	if !tkn.Valid {
		fmt.Println("Invalid token")
		return false
	}

	return true
}

func Refresh(tokenStr string)  (LoginResult, error) {
	
	claims := &Claims{}

	tkn, err := jwt.ParseWithClaims(tokenStr, claims,
		func(t *jwt.Token) (interface{}, error) {
			return jwtKey, nil
		})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return LoginResult{}, err
		}
		return LoginResult{}, err
	}
	if !tkn.Valid {
		return LoginResult{}, err
	}

	// if time.Unix(claims.ExpiresAt, 0).Sub(time.Now()) > 30*time.Second {
	// 	w.WriteHeader(http.StatusBadRequest)
	// 	return
	// }

	expirationTime := time.Now().Add(time.Minute * 5)

	claims.ExpiresAt = expirationTime.Unix()

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
	tokenString, err := token.SignedString(jwtKey)

	if err != nil {
		return LoginResult{}, err
	}
	return LoginResult{
		Token:      tokenString,
		ExpireDate: expirationTime,
	}, nil

}
func getUserPassword(username string) (string, error) {
	// var password string
	var user models.User
	database.DB.Where("username = ?", username).First(&user)
	if user.ID == 0 {
		return "", nil
	}
	return user.Password, nil
}