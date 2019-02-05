package main

import (
	"fmt"
	"os"
	"os/exec"

	"example.com/socket-server/core"
	"example.com/socket-server/libs/log"
	"example.com/socket-server/libs/vars"
)

func main() {
	var watcher *exec.Cmd

	mainLogger := log.NewLogger("main")
	if vars.IsDebug {
		mainLogger.Info(`Server running under debug mode. Set enviroment variable ` +
			`SOCK_ENV to PRODUCTION to run server in production mode.`)
	}

	// Start subprocess
	go func() {
		if vars.IsWithWebpackWatcher {
			watcher = exec.Command("npm", "run", "start")

			watcher.Dir = "./client"

			watcher.Stdout = os.Stdout
			watcher.Stderr = os.Stderr

			err := watcher.Run()
			if err != nil {
				fmt.Printf("%v\n", err)
				return
			}
		}
	}()

	var server = core.NewServer(vars.IsDebug)
	// Start server here at pre-defined port
	server.Run()

	if vars.IsWithWebpackWatcher {
		mainLogger.Infof("Stopping process %d", watcher.Process.Pid)
		if err := watcher.Process.Signal(os.Interrupt); err != nil {
			fmt.Printf("%v\n", err)
		}
	}
}
