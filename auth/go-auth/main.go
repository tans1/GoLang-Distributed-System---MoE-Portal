package main

import (
	"database/sql"
	"log"
	"net/http"

	_ "github.com/go-sql-driver/mysql" 
)

var db *sql.DB

func main() {
	// Initialize the database connection
	dbConn, err := sql.Open("mysql", "tada:tadael@tcp(localhost:3306)/AUTH")
	if err != nil {
		log.Fatal(err)
	}
	defer dbConn.Close()

	// Assign the initialized database connection to the global variable
	db = dbConn

	// Set up your HTTP routes and server
	http.HandleFunc("/register", Register)
	http.HandleFunc("/login", Login)
	http.HandleFunc("/home", Home)
	http.HandleFunc("/refresh", Refresh)

	// Start the server
	log.Fatal(http.ListenAndServe(":8080", nil))
}
