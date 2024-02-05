package main

import (
	"errors"
	"fmt"
	"log"
	"net/http"
	config "petition1/config"
	"sync"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/gorilla/websocket"
)

var (
	docMutex sync.Mutex
)
var cache = make(map[string]TextDocument)

type Client struct {
	hub      *Hub
	conn     *websocket.Conn
	Send     chan *TextDocument
	Document TextDocument
}

type User struct {
	FirstName string
	LastName  string
	Email     string
}

type TextDocument struct {
	Title        string
	Text         string
	CreationDate time.Time
	OwnerId      int
}

type SignPetition struct {
	UserId     int
	PetitionName string
}

type Hub struct {
	clients    map[*Client]bool
	broadcast  chan *TextDocument
	register   chan *Client
	unregister chan *Client
}

func newHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan *TextDocument),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.Send)
			}
		case doc := <-h.broadcast:
			cache[doc.Title] = *doc
			for client := range h.clients {
				client.Document.Text = string(doc.Text)
				select {
				case client.Send <- &client.Document:
				default:
					close(client.Send)
					delete(h.clients, client)
				}
			}
		}
	}
}

var upgrader = websocket.Upgrader{
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}

func saveDocument(document TextDocument) (TextDocument,error) {

	if document.Title == ""{
		return document,errors.New("title and text must not be empty")
	}

	fmt.Println(document.Title,document.Text,document.CreationDate,document.OwnerId)
	query := `INSERT INTO Petition(Name, text, CreationDate, OwnerId)
	 VALUES (?, ?, ?, ?)`
	_, err := config.Db.Exec(query, document.Title, document.Text, document.CreationDate, document.OwnerId)

	fmt.Println(err)
	return document,err
}
func getDocument(documentName string) (TextDocument,error) {

	var (
		Name         string
		text         string
		CreationDate []uint8
		OwnerId      int
	)

	err := config.Db.QueryRow(`SELECT Name,text,CreationDate,OwnerId 
	FROM Petition where Name = ? ORDER BY PetitionId DESC LIMIT 1`, documentName).Scan(&Name, &text, &CreationDate, &OwnerId)
	
	layout := "2006-01-02"
	modifiedDate, _ := time.Parse(layout, string(CreationDate))
	fmt.Println(modifiedDate,"modifiedDate",string(CreationDate))
	docMutex.Lock()
	doc := TextDocument{
		Title:        Name,
		Text:         text,
		CreationDate: modifiedDate,
		OwnerId:      OwnerId,
	}

	docMutex.Unlock()

	return doc,err

}

func handleConnections(hub *Hub, c *gin.Context) {
	conn, err := upgrader.Upgrade(c.Writer, c.Request, nil)
	if err != nil {
		log.Fatal(err)
		return
	}
	
	var doc TextDocument
	documentName := c.Request.URL.Query().Get("document")

	for k, v := range cache {
        fmt.Println(k, "value is", v)
    }

	if document, ok := cache[documentName]; ok {
		doc = document
	} else {
		doc,_ = getDocument(documentName)
		fmt.Println(doc,"Got it from database")
		cache[documentName] = doc
	}
	
	client := &Client{hub: hub, conn: conn, Send: make(chan *TextDocument), Document: doc}
	hub.register <- client

	go client.write()
	go client.read()
	fmt.Println(doc.Text,"document recieved")
	client.Send <- &doc
}

func (c *Client) read() {
	defer func() {
		fmt.Println(len(c.hub.clients))
		if len(c.hub.clients) == 1 {
			saveDocument(cache[c.Document.Title])
		}
		c.hub.unregister <- c
		c.conn.Close()
	}()

	for {
		_, message, err := c.conn.ReadMessage()
		c.Document.Text = string(message)
		if err != nil {
			break
		}

		c.hub.broadcast <- &c.Document
	}
}

func (c *Client) write() {
	defer c.conn.Close()
	for{
		select {
		case doc, ok := <-c.Send:
			if !ok {
				return
			}
			fmt.Println(doc.Text,"document to be sent to the client")
			c.Document.Text = doc.Text
			c.conn.WriteMessage(websocket.TextMessage, []byte(doc.Text))
		}
	}
}
func getAll()( []TextDocument,error) {

	query := `SELECT Name, Text, CreationDate, OwnerId
	FROM Petition
	WHERE (PetitionId, Name) IN 
		(SELECT MAX(PetitionId), Name
		 FROM Petition
		 GROUP BY Name);
	`
	rows, err := config.Db.Query(query)
	
	defer rows.Close()

	var res []TextDocument = make([]TextDocument, 0)
	for rows.Next() {
		var name string
		var CreationDate []uint8
		var OwnerId int
		var Text string
		if err := rows.Scan(&name, &Text, &CreationDate, &OwnerId); err != nil {
			continue
		}

		layout := "2006-01-02"
		tm, _ := time.Parse(layout, string(CreationDate))
		res = append(res, TextDocument{Title: name, CreationDate: tm, OwnerId: OwnerId, Text: Text})
	}

	return res,err

}

func getAllPetitions(c *gin.Context) {
	petitions,err := getAll()
	if (err != nil){
		c.IndentedJSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve petitions"})
		return
	}else{

		c.IndentedJSON(http.StatusOK, petitions)
	}
}

func createPetition(c *gin.Context) {
	var document TextDocument
	if err := c.BindJSON(&document); err != nil {
		return
	}
	_,err := getDocument(document.Title)
	if (err == nil){
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create petition"})
		return
	}

	document.CreationDate = time.Now()

	doc,err := saveDocument(document)
	if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create petition"})
        return
    }
    c.JSON(http.StatusOK, gin.H{"message": "Petition created successfully", "petition": doc})

}

func signPetition(c *gin.Context) {
	var signPetition SignPetition
	if err := c.BindJSON(&signPetition); err != nil {
		return
	}

	query := "INSERT INTO SignPetition(PetitionName,UserId) VALUES (?, ?)"
	_, err := config.Db.Exec(query, signPetition.PetitionName, signPetition.UserId)

	if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to sign petition"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"message": "Petition signed successfully", "signPetition": signPetition})
}

func getSignatories(c *gin.Context) {
	petitionName := c.Query("PetitionName")
	query := `SELECT FirstName, LastName, Email FROM Users JOIN SignPetition 
	ON Users.UserId = SignPetition.UserId WHERE SignPetition.PetitionName = ` + petitionName + " "
	rows, err := config.Db.Query(query)
	if (err != nil){
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to retrieve signatories"})
		return 
	}
	defer rows.Close()
	var users = make([]User, 0)
	for rows.Next() {
		var user = User{}
		err := rows.Scan(&user.FirstName, &user.LastName, &user.Email)
		if err != nil {
			log.Print(err)
		}
		users = append(users, user)

	}

	c.IndentedJSON(http.StatusOK, users)
}

func main() {
	hub := newHub()
	go hub.run()

	router := gin.Default()

	router.GET("/ws", func(c *gin.Context) {
		handleConnections(hub, c)
	})
	router.GET("/petitions", getAllPetitions)
	router.POST("/createPetition", createPetition)
	router.POST("/signPetition", signPetition)
	router.GET("/signatories", getSignatories)
	router.Run("localhost:3033")
	log.Println("Server is running on :3033")

}
