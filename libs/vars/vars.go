package vars

import "flag"

// Common state variable set at startup
var (
	IsDebug bool
)

func init() {
	flag.BoolVar(&IsDebug, "debug", false, "Force server to run under debug mode.")

	flag.Parse()
}
