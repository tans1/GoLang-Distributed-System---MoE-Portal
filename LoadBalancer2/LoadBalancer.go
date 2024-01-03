package main

import (
	"context"
	"fmt"
	"log"
	"net"
	"net/http"
	"net/http/httputil"
	"net/url"
	"os"
	"sync"
	"time"
	"go.etcd.io/etcd/client/v3"
)


type DistributedLock struct {
	Key        string
	Value      string
	LeaseID    clientv3.LeaseID
	etcdClient *clientv3.Client
}

func (dl *DistributedLock) Lock(ctx context.Context, ttl int64) error {
	lease, err := dl.etcdClient.Grant(ctx, ttl)
	if err != nil {
		return err
	}

	_, err = dl.etcdClient.Put(ctx, dl.Key, dl.Value, clientv3.WithLease(lease.ID))
	if err != nil {
		return err
	}

	dl.LeaseID = lease.ID
	log.Printf("Lock acquired: %s", dl.Key)
	return nil
}

func (dl *DistributedLock) Unlock(ctx context.Context) error {
	_, err := dl.etcdClient.Delete(ctx, dl.Key)
	if err != nil {
		return err
	}

	_, err = dl.etcdClient.Revoke(ctx, dl.LeaseID)
	if err != nil {
		return err
	}

	log.Printf("Lock released: %s", dl.Key)
	return nil
}


type LoadBalancer struct {
	servers []*url.URL
	mutex   sync.Mutex
}

func (lb *LoadBalancer) nextServer() *url.URL {
	lb.mutex.Lock()
	defer lb.mutex.Unlock()

	// Simple round-robin load balancing
	server := lb.servers[0]
	lb.servers = append(lb.servers[1:], server)
	lb.servers = append(lb.servers, server)

	return server
}

func (lb *LoadBalancer) handleRequest(w http.ResponseWriter, r *http.Request) {
	server := lb.nextServer()

	// Reverse proxy to the selected backend server
	proxy := httputil.NewSingleHostReverseProxy(server)
	proxy.ServeHTTP(w, r)
}

func (lb *LoadBalancer) start(dl DistributedLock,ctx context.Context){

	for {
		fmt.Println("Start method called")
		// Acquire the lock
		err := dl.Lock(ctx, 10) // Set TTL to 10 seconds
		defer func() {
			// Defer unlocking when finished
			err := dl.Unlock(context.Background()) // Think about unlocking with ctx
			if err != nil {
				log.Fatal(err)
			}
		}()
		if err != nil {
			fmt.Println("Unable to acure lock")
			log.Fatal(err)

		}else{

			// Access the shared storage
			// For example, read or update the active server location
			activeServerLocation := dl.Value
			fmt.Printf("Active loaction Heeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee",activeServerLocation)
			fmt.Printf("doneeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee")
			// Call the active server
			isActive, _ := lb.checkHealth(activeServerLocation)
			fmt.Println(isActive,"boooooooooooooooooooooooooooooooooooool")
			
			if isActive == false {

				fmt.Printf("This is the active server loaction",activeServerLocation)
				// If active server returns False, start listening at the active port
				lb.startListening(activeServerLocation)
				break
			} else {
				// If True, continue waiting or perform other operations
				log.Println("Waiting for the active server...")
				// Additional logic as needed
			}
		}
	}
}
func (lb *LoadBalancer) checkHealth(address string)(bool,error){
	 fmt.Printf("checking health hhhhhhhhhhhhhhhhhhhh")
	conn, err := net.DialTimeout("tcp", address, 1*time.Second)
	if err != nil {
		return false,err
	}

	conn.Close()
	return true,err
}
func (lb *LoadBalancer) startListening(address string){
	fmt.Printf("about to start sever",address)
	http.ListenAndServe(address, nil)
	fmt.Printf("Started listening")
}

func main() {
	lb := &LoadBalancer{
		servers: []*url.URL{
			parseURL("http://localhost:8001"),
			parseURL("http://localhost:8002"),
			// Add more backend servers as needed
		},
	}
	http.HandleFunc("/", lb.handleRequest)

	endpoints := []string{"localhost:2379"}

	cfg := clientv3.Config{
		Endpoints:   endpoints,
		DialTimeout: 5 * time.Second,
	}

	client, err := clientv3.New(cfg)
	if err != nil {
		fmt.Printf("Error connecting to etcd: %v", err)
		os.Exit(1)
	}

	defer client.Close()

	ctx := context.Background()
	lockKey := "active-sever-address"
	lockValue := ":8080"

	dl := DistributedLock{
		Key:        lockKey,
		Value:      lockValue,
		etcdClient: client,
	}	
	
	lb.start(dl,ctx)

}

func parseURL(rawURL string) *url.URL {
	u, err := url.Parse(rawURL)
	if err != nil {
		panic(err)
	}
	return u
}
