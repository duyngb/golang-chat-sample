package main

import (
	"example.com/socket-server/core"
	"example.com/socket-server/libs/log"
	"example.com/socket-server/libs/vars"
)

func main() {
	mainLogger := log.NewLogger("main")
	if vars.IsDebug {
		mainLogger.Info(`Server running under debug mode. Set enviroment variable ` +
			`SOCK_ENV to PRODUCTION to run server in production mode.`)
	}

	var server = core.NewServer(vars.IsDebug)
	// Start server here at pre-defined port
	server.Run()
}
