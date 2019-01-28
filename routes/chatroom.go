package routes

import (
	"example.com/socket-server/libs/chat"

	"github.com/gorilla/websocket"
	"github.com/labstack/echo"
)

var upgrader = websocket.Upgrader{}

// ChatRoom route implements chatroom routes and logic.
type ChatRoom struct {
	// Common hub set by the server
	Hub *chat.Hub
}

func (r *ChatRoom) init(prefix string, s *echo.Echo, mi ...echo.MiddlewareFunc) {
	g := s.Group(prefix, mi...)
	g.GET("", r.landingPage)
	g.GET("/ws", r.chatroom)
}

func (r *ChatRoom) landingPage(c echo.Context) error {
	return c.File("client/dist/chatroom.html")
	// return c.Render(http.StatusOK, "chatroom/chatroom.html", nil)
}

func (r *ChatRoom) chatroom(c echo.Context) error {
	var (
		conn   *websocket.Conn
		client *chat.Client
	)

	conn, e := upgrader.Upgrade(c.Response(), c.Request(), nil)
	if e != nil {
		c.Logger().Errorf("ws connection upgrade failed: %v", e)
		return e
	}

	client = chat.NewClient(r.Hub, conn)
	client.Register()

	// Allow collection of memory referenced by the caller
	// by doing all work in new goroutines.
	go client.WritePump()
	go client.ReadPump()

	return nil
}
