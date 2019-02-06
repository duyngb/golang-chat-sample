package routes

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/labstack/echo/v4"
)

// D routes
type D struct{}

type singleID struct {
	ID string
}

type failedCode struct {
	Source string
}

func (r *D) init(prefix string, s *echo.Echo, mi ...echo.MiddlewareFunc) {
	g := s.Group(prefix, mi...)
	g.GET("", r._get)
	g.GET("/:id", r._getWithID)
	g.GET("/error-page/:code", r.testError)
}

func (r *D) _get(c echo.Context) error {
	return c.String(http.StatusOK, "This is a sound from the other side of the string!")
}

func (r *D) _getWithID(c echo.Context) error {
	id := c.Param("id")
	return c.Render(http.StatusOK, "debug/get-with-id.html", singleID{id})
}

func (r *D) testError(c echo.Context) error {
	errorCode, parseErr := strconv.Atoi(c.Param("code"))
	if parseErr != nil {
		return c.Render(http.StatusBadRequest,
			"debug/invalid-code.html",
			failedCode{c.Param("code")})
	}
	errorPage := fmt.Sprintf("error-pages/%d.html", errorCode)
	return c.Render(http.StatusOK, errorPage, nil)
}
