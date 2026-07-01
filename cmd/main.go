package main

import (
	"log"
	"time"

	"github.com/yigithankarabulut/distributed-file-storage/crypto"
	"github.com/yigithankarabulut/distributed-file-storage/fileserver"
	"github.com/yigithankarabulut/distributed-file-storage/p2p"
	"github.com/yigithankarabulut/distributed-file-storage/store"
)

// Global server instance (used by API handlers)
var server *fileserver.FileServer

func makeServer(listenAddr string, nodes ...string) *fileserver.FileServer {
	tcpTransport := p2p.NewTCPTransport(
		p2p.WithListenAddr(listenAddr),
		p2p.WithHandshakeFunc(p2p.NOPHandshakeFunc),
		p2p.WithDecoder(&p2p.DefaultDecoder{}),
	)

	encryptKey, err := crypto.NewEncryptionKey()
	if err != nil {
		log.Fatal(err)
	}

	fileServerOpts := fileserver.ServerOpts{
		EncryptKey:        encryptKey,
		StorageRoot:       "node" + listenAddr[1:] + "_network",
		PathTransformFunc: store.CASPathTransformFunc,
		Transport:         tcpTransport,
		BootstrapNodes:    nodes,
	}

	s := fileserver.NewFileServer(fileServerOpts)
	tcpTransport.OnPeer = s.OnPeer

	return s
}

func main() {
	s1 := makeServer(":3000", "")
	s2 := makeServer(":4000", "")
	server = makeServer(":5000", ":3000", ":4000")

	go func() {
		log.Fatal(s1.Start())
	}()
	time.Sleep(1 * time.Second)

	go func() {
		log.Fatal(s2.Start())
	}()
	time.Sleep(2 * time.Second)

	go func() {
		log.Fatal(server.Start())
	}()
	time.Sleep(2 * time.Second)

	// Start HTTP API
	startAPI()

	log.Println("CloudVault backend started successfully.")

	// Keep the servers running
	select {}
}