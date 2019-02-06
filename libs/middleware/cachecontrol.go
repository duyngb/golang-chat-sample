package middleware

import (
	"fmt"

	"github.com/labstack/echo/v4"
)

// CacheControl updates response with Cache-Control header.
func CacheControl(maxAge int) echo.MiddlewareFunc {
	return func(next echo.HandlerFunc) echo.HandlerFunc {
		return func(c echo.Context) error {
			c.Response().Header().Set("Cache-Control", fmt.Sprintf("max-age=%d", maxAge))
			return next(c)
		}
	}
}
