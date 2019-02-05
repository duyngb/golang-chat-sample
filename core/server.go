package core

import (
	"context"
	"os"
	"os/signal"
	"time"

	"example.com/socket-server/libs/chat"
	"example.com/socket-server/libs/log"
	"example.com/socket-server/routes"

	"github.com/labstack/echo"
	"github.com/labstack/echo/middleware"
)

// Server is an extended wrapper for echo.Echo
type Server struct {
	*echo.Echo

	Hub *chat.Hub
}

// NewServer create an echo server wrapped inside core.Server type.
func NewServer(isDebug bool) *Server {

	e := echo.New()
	h := chat.NewHub()

	// Initialize server with required configurations
	e.Use(
		middleware.Recover(),
		middleware.LoggerWithConfig(middleware.LoggerConfig{
			Format: "${remote_ip}->${host} ${status} ${method} ${uri} (${latency_human})\n",
		}),
		middleware.Static("public"),
		middleware.Static("client/dist"))

	// Register template renderer
	e.Renderer = newRenderer(isDebug)
	// Register error handler
	e.HTTPErrorHandler = httpErrorHandler

	// Process server with debug signal, if present
	e.Debug = isDebug

	e.Logger = log.NewLogger("echo")

	// Bind routes
	routes.Bind("/", &routes.DefaultRoute{}, e)
	routes.Bind("/d", &routes.D{}, e)
	routes.Bind("/chatroom", &routes.ChatRoom{Hub: h}, e)

	// Cast original echo server to our alias
	return &Server{e, h}
}

// Run runs internal echo server.
func (s *Server) Run() {
	// if err := e.StartTLS(":8001", "etc/cert.pem", "etc/key.pem"); err != nil {
	// 	e.Logger.Fatal("Shutting down TLS server due to error...")
	// 	e.Logger.Fatal(err)
	// }

	go s.Hub.Run()

	if err := s.Start("localhost:8000"); err != nil {
		s.Logger.Fatal("Shutting down HTTP server due to error...")
		s.Logger.Fatal(err)
	}

	// Wait for interrupt signal
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel() // Release resource if op complete before timed out

	if err := s.Shutdown(ctx); err != nil {
		s.Logger.Fatal(err)
	}

}
