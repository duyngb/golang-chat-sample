package main

import (
	"example.com/socket-server/core"
	"example.com/socket-server/libs/log"
	"example.com/socket-server/libs/vars"
)

func main() {
	mainLogger := log.NewLogger("main")
	if vars.IsDebug {
		mainLogger.Info("NOTE: Server running under debug mode")
	}

	var server = core.NewServer()
	// Start server here at pre-defined port
	err := server.Run()
	if err != nil {
		mainLogger.Panicf("Server start up failed: %v", err)
		panic(err)
	}
}
