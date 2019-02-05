package vars

import "os"

// Common state variable set at startup
var (
	IsDebug              bool
	IsWithWebpackWatcher bool
)

func init() {
	// Check for debug mode based on environment variable
	IsDebug = os.Getenv("SOCK_ENV") != "PRODUCTION"

	IsWithWebpackWatcher = os.Getenv("SOCK_WITH_WEBPACK") != ""

}
