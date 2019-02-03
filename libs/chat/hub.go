// Package chat includes definitions for socket-based chat applications.
package chat

import (
	"encoding/json"
	"time"

	"example.com/socket-server/libs/log"
)

var hubLogger = log.NewLogger("hub")

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
			go h.Announce(ClientJoined, client.name)
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client) // <- Remove client from registered list
				close(client.send)        // <- Close send channel
				go h.Announce(ClientLeaved, client.name)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
					hubLogger.Debugf("send -> %s", client.name)
				default:
					// Fallback when failed to send, e.g., connection closed by client.
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

// Announce broadcasts annoucement message to all registered clients.
func (h *Hub) Announce(e Event, content string) {
	msg, err := json.Marshal(Frame{
		Event:     e,
		Timestamp: int(time.Now().UnixNano() / 1e6),
		Content:   content,
		Who:       "Announcement",
	})
	if err != nil {
		hubLogger.Error(err)
		return
	}
	h.Broadcast(msg)
}
