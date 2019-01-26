// Package chat includes definitions for socket-based chat applications.
package chat

import (
	"fmt"

	"example.com/socket-server/libs/common"
	"github.com/labstack/gommon/log"
)

var hubLogger = log.New("hub")

func init() {
	hubLogger.SetHeader(common.LogHeader)
}

// Hub maintains the set of active clients and broadcasts
// messages to the clients.
//
// It is server responsibility to maintain Hub.Run routine in
// its own loop.
type Hub struct {
	// Registered clients
	clients map[*Client]bool

	// Broadcast channel
	broadcast chan []byte

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from the clients.
	unregister chan *Client
}

// NewHub create a new hub for a single chatroom.
func NewHub() *Hub {
	return &Hub{
		clients:    make(map[*Client]bool),
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
	}
}

// Run runs hubs. This should be invoked as a go routine.
func (h *Hub) Run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
			hubLogger.Debugf("New client registered: %p", client.conn)
			go h.Broadcast(msgFmt("New client join: %p", client.conn))
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client) // Remove client from registered list
				close(client.send)
				go h.Broadcast(msgFmt("Client %p leave", client.conn))
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
					hubLogger.Debugf("send %p <- %s", client.conn, message)
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}

// Broadcast broadcasts message to every client.
func (h *Hub) Broadcast(message []byte) {
	h.broadcast <- message
}

func msgFmt(format string, a ...interface{}) []byte {
	return []byte(fmt.Sprintf(format, a...))
}
