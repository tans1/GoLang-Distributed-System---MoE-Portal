package main

import (
	"net/http"
	"net/http/httptest"
	"strings"
	"testing"

	"github.com/google/uuid"

	"github.com/gin-gonic/gin"
)

func TestGetAllPetitions(t *testing.T) {
 gin.SetMode(gin.TestMode)

 req, err := http.NewRequest("GET", "/petitions", nil)
 if err != nil {
  t.Fatal(err)
 }

 rr := httptest.NewRecorder()
 router := gin.Default()
 router.GET("/petitions", getAllPetitions)
 router.ServeHTTP(rr, req)

 if status := rr.Code; status != http.StatusOK {
  t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
 }


}

func TestCreatePetition(t *testing.T) {
 gin.SetMode(gin.TestMode)

 newUUID := uuid.New()

 // Convert UUID to string
 uuidString := newUUID.String()


payload := `{"Title":"` + uuidString + `","Text":"This is a test petition","OwnerId":1}`
 req, err := http.NewRequest("POST", "/createPetition", strings.NewReader(payload))
 if err != nil {
  t.Fatal(err)
 }
 req.Header.Set("Content-Type", "application/json")

 rr := httptest.NewRecorder()
 router := gin.Default()
 router.POST("/createPetition", createPetition)
 router.ServeHTTP(rr, req)

 if status := rr.Code; status != http.StatusOK {
  t.Errorf("Handler returned wrong status code: got %v want %v", status, http.StatusOK)
 }

 
}