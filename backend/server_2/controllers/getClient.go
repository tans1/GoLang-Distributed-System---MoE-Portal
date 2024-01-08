package controllers

import (
	"net"
	"time"
)

func checkHealth(address string) (bool, error) {
	conn, err := net.DialTimeout("tcp", address, 1*time.Second)
	if err != nil {
		return false, err
	}
	conn.Close()
	return true, err
}
func GetClient() (string, error){
	clients := []string {
		"localhost:8001",
		"localhost:8002",
	}
	for _,client := range clients {
		isActive, _ := checkHealth(client)
		if isActive {
			return client,nil
		}
	}
	return "",nil
}