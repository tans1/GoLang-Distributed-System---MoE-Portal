package main

import (
	"fmt"
	"io/ioutil"
	"net/http"
	"time"
)

var ct int = 0
func main() {
	
	// Simulate multiple clients making requests
	for {

			makeRequest()
			time.Sleep(2*time.Second)	
	}

}

func makeRequest() {
	resp, err := http.Get("http://localhost:8080")
	if err != nil {
		fmt.Println("Error making request:", err)
		return
	}
	defer resp.Body.Close()

	body, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("Error reading response body:", err)
		return
	}
	ct += 1
	fmt.Println("Response:", string(body),ct)
}
