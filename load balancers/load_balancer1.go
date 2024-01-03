package main

import (
	"fmt"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
)

type Server interface {
  Address() string
  ISAlive() bool
  Serve(rw http.ResponseWriter, req *http.Request)
}

type singleServer struct {
  address string
  proxy *httputil.ReverseProxy

}
type LoadBalancer struct {
	port string
	rbServerIndex int
	servers []Server
  }

  
func handleError(error error,message string) {
if error != nil {
  fmt.Println("[ERROR]:",message, error)
  os.Exit(1)
}
}


func createServer(address string) *singleServer {
  serverUrl,error := url.Parse(address)
  handleError(error,"failed to parse url")

return &singleServer{
  address: address,
  proxy: httputil.NewSingleHostReverseProxy(serverUrl),
}

}

func (s *singleServer) Address() string {
  return s.address
}

func (s *singleServer) ISAlive() bool {
  return true
}

func (s *singleServer) Serve(rw http.ResponseWriter, req *http.Request) {
	// to forward the incoming request
  s.proxy.ServeHTTP(rw,req)
}

func createLoadBalancer(port string ,servers []Server) *LoadBalancer {
  return &LoadBalancer{
    port: port,
    rbServerIndex:0,
    servers: servers,
  }
}

func (lb *LoadBalancer) GetAvailableServer() Server {
  server := lb.servers[lb.rbServerIndex%len(lb.servers)]

  fmt.Println("index", lb.rbServerIndex, server, server.ISAlive())
  for !server.ISAlive() {
    lb.rbServerIndex++
	fmt.Println(lb.rbServerIndex, len(lb.servers))
    server = lb.servers[lb.rbServerIndex%len(lb.servers)]
  }
  lb.rbServerIndex++

  // handle the round robin here
  return server
}

func (lb *LoadBalancer) serveProxy(rw http.ResponseWriter,req *http.Request) {
  targetServer := lb.GetAvailableServer()
  fmt.Println("[SUCCESS]: Forwarding request to ",targetServer.Address())
  targetServer.Serve(rw,req)
}

func main(){
  servers := []Server {
    createServer("https://www.wikipedia.org/"),
    createServer("https://facebook.com"),
    createServer("https://github.com"),
    createServer("https://youtube.com"),
}

  lb := createLoadBalancer("8080",servers)

  redirect := func(rw http.ResponseWriter, req *http.Request) {
	fmt.Println("[INFO]: Handling request")
    lb.serveProxy(rw,req) // handle incoming request and forward the request to next active server
  }
  http.HandleFunc("/", redirect)

  fmt.Println("[INFO]: Starting server on port", lb.port)
  http.ListenAndServe(":"+lb.port,nil)
}
