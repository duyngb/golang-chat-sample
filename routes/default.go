package routes

import (
	"net/http"

	"github.com/labstack/echo"
)

// DefaultRoute hold default landing page route.
type DefaultRoute struct{}

func (r *DefaultRoute) init(prefix string, s *echo.Echo, mi ...echo.MiddlewareFunc) {
	g := s.Group(prefix, mi...)
	g.GET("", r.defaultIndex)
}

func (r *DefaultRoute) defaultIndex(c echo.Context) error {
	return c.Render(http.StatusOK, "index.html", struct{}{})
}
