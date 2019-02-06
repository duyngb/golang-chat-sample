package routes

import (
	"github.com/labstack/echo/v4"
)

// SimpleRoute holds basic methods for manage a single route.
//
// All subsequence type must implement this interface to use
// routes.Bind method.
type SimpleRoute interface {
	init(prefix string, echoServer *echo.Echo, middlewareFuncs ...echo.MiddlewareFunc)
}

// RouteInfo holds information to bind routes to an echo server.
type RouteInfo struct {
	Prefix          string
	Route           SimpleRoute
	MiddlewareFuncs []echo.MiddlewareFunc
}

// RouteInfoCollections is a type alias for collection of route
// info objects.
type RouteInfoCollections []*RouteInfo

// Bind binds a specific route to an echo server.
func (ri *RouteInfo) Bind(e *echo.Echo) {
	ri.Route.init(ri.Prefix, e, ri.MiddlewareFuncs...)
}

// Bind binds multiple routes in route info collection to an echo server.
func (ris RouteInfoCollections) Bind(e *echo.Echo) {
	for _, ri := range ris {
		ri.Route.init(ri.Prefix, e, ri.MiddlewareFuncs...)
	}
}

// Bind binds a route to an Echo server.
func Bind(prefix string, r SimpleRoute, e *echo.Echo, m ...echo.MiddlewareFunc) {
	r.init(prefix, e, m...)
}
