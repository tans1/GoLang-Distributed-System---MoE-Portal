package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("I am server 8002")
		fmt.Fprintf(w, "Hello from backend server!")
	})

	fmt.Println("Backend server listening on :8002")
	http.ListenAndServe(":8002", nil)
}
