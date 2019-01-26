package main

import (
	"example.com/socket-server/core"
)

func main() {
	var server = core.NewServer()
	// Start server here at pre-defined port
	server.Run()
}
