package chat

import (
	"fmt"
	"time"

	"example.com/socket-server/libs/common"

	"github.com/gorilla/websocket"
	"github.com/labstack/gommon/log"
)

const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

var (
	newline = []byte{'\n'}
	space   = []byte{' '}

	clientLogger = log.New("client")
)

func init() {
	clientLogger.SetHeader(common.LogHeader)
}

// Client is a middleman between the websocket connection and the hub.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	// Buffered channel of outbound messages.
	//
	// Read from this channel to receive send request from hub
	// to client connection.
	send chan []byte

	// Disconect signal from client.
	//
	// On unregister process, a client will push disconect signal
	// to this channel. Use this channel outside client package
	// context to terminate handler function on server side.
	Disconnected chan bool
}

// NewClient create a new client based from a Hub and a Conn.
func NewClient(hub *Hub, conn *websocket.Conn) *Client {
	return &Client{
		hub:          hub,
		conn:         conn,
		send:         make(chan []byte, 255),
		Disconnected: make(chan bool),
	}
}

// Register registers current client to binded hub.
func (c *Client) Register() {
	c.hub.register <- c
}

// ReadPump pumps messages from the websocket connection to the hub.
//
// The application runs readPump in a per-connection goroutine. The application
// ensures that there is at most one reader on a connection by executing all
// reads from this goroutine.
func (c *Client) ReadPump() {
	// Defere cleanup routine when function exit
	defer c.unregister()

	c.conn.SetReadLimit(maxMessageSize)
	c.conn.SetReadDeadline(time.Now().Add(pongWait))
	c.conn.SetPongHandler(func(string) error {
		return c.conn.SetReadDeadline(time.Now().Add(pongWait))
	})

	// Start process message from client
	for {
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway) {
				clientLogger.Infof("client disconnected | %v", err)
			}
			break
		}
		// message = bytes.TrimSpace(bytes.Replace(message, newline, space, -1))
		message = []byte(fmt.Sprintf("%p: %s", c.conn, message))
		c.hub.Broadcast(message)
	}
}

// WritePump pumps messages from the hub to the websocket connection.
//
// A goroutine running WritePump is started for each connection. The
// application ensures that there is at most one writer to a connection by
// executing all writes from this goroutine.
func (c *Client) WritePump() {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send: // Send request
			clientLogger.Debugf("Received send request: %s", message)
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if !ok {
				// Hub closes channel.
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				clientLogger.Errorf("client writer initialization failed: %v", err)
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				clientLogger.Errorf("client ping failed: %v", err)
				// For most case, connection has been closed in somewhere,
				// and we have nothing to do with this.
				return
			}
		}
	}
}

// unregister myself from hub.
func (c *Client) unregister() {
	c.hub.unregister <- c
	c.Disconnected <- true
	c.conn.Close()
	close(c.Disconnected)
}
