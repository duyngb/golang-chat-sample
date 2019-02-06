package core

import (
	"context"
	"os"
	"os/signal"
	"time"

	"example.com/socket-server/libs/chat"
	"example.com/socket-server/libs/log"
	selfMiddleware "example.com/socket-server/libs/middleware"
	"example.com/socket-server/libs/vars"
	"example.com/socket-server/routes"

	"github.com/labstack/echo/v4"
	"github.com/labstack/echo/v4/middleware"
)

// Server is an extended wrapper for echo.Echo
type Server struct {
	*echo.Echo

	Hub *chat.Hub
}

// NewServer create an echo server wrapped inside core.Server type.
func NewServer() *Server {
	isDebug := vars.IsDebug

	e := echo.New()
	h := chat.NewHub()

	// Initialize server with required configurations
	if vars.GZipEnabled {
		e.Use(middleware.GzipWithConfig(middleware.GzipConfig{
			Level: vars.GZipLevel,
		}))
	}

	e.Use(
		middleware.Recover(),
		middleware.LoggerWithConfig(middleware.LoggerConfig{
			Format: "${remote_ip}->${host} ${status} ${method} ${uri} (${latency_human})\n",
		}),
		selfMiddleware.CacheControl(vars.CacheMaxAge),
		middleware.Static("public"),
		middleware.Static("client/dist"),
	)

	// Register template renderer
	e.Renderer = newRenderer(isDebug)
	// Register error handler
	e.HTTPErrorHandler = httpErrorHandler

	// Process server with debug signal, if present
	e.Debug = isDebug
	e.HideBanner = !isDebug

	e.Logger = log.NewLogger("echo")

	// Bind routes
	routes.Bind("/", &routes.DefaultRoute{}, e)
	routes.Bind("/d", &routes.D{}, e)
	routes.Bind("/chatroom", &routes.ChatRoom{Hub: h}, e)

	// Cast original echo server to our alias
	return &Server{e, h}
}

// Run runs internal echo server.
func (s *Server) Run() error {
	var err error

	go s.Hub.Run()

	if vars.TLS {
		err = s.StartTLS(vars.Address, vars.CertFile, vars.KeyFile)
	} else {
		err = s.Start(vars.Address)
	}
	if err != nil {
		return err
	}

	// Wait for interrupt signal
	quit := make(chan os.Signal)
	signal.Notify(quit, os.Interrupt)
	<-quit
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel() // Release resource if op complete before timed out

	if err := s.Shutdown(ctx); err != nil {
		return err
	}

	return nil
}
