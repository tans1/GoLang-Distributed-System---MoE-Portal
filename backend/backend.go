package main

import (
	"fmt"
	"net/http"
)

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "Hello from backend server!")
	})

	fmt.Println("Backend server listening on :8001")
	http.ListenAndServe(":8001", nil)
}
