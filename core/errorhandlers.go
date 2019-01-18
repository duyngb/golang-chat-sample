package core

import (
	"bytes"
	"fmt"
	"net/http"

	"github.com/labstack/echo"
)

type errData struct{}

func httpErrorHandler(err error, c echo.Context) {
	code := http.StatusInternalServerError

	if httpError, ok := err.(*echo.HTTPError); ok {
		code = httpError.Code
	}

	if c.Echo().Renderer == nil {
		c.Logger().Error(echo.ErrRendererNotRegistered)
	}

	errorPage := fmt.Sprintf("error-pages/%d.html", code)
	buf := new(bytes.Buffer)
	if err = c.Echo().Renderer.Render(buf, errorPage, nil, c); err != nil {
		c.Logger().Error(err)
	}

	if err := c.HTMLBlob(code, buf.Bytes()); err != nil {
		c.Logger().Error(err)
	}

	// c.Logger().Error(err)
}
