package vars

import "flag"

// Common state variable set at startup
var (
	IsDebug     bool
	TLS         bool
	CertFile    string
	KeyFile     string
	Address     string
	GZipEnabled bool
	GZipLevel   int
)

func init() {
	// Debug configs
	flag.BoolVar(&IsDebug, "debug", false, "Enable debug mode.")

	// TLS configs
	flag.BoolVar(&TLS, "tls", false, "Enable TLS.")
	flag.StringVar(&CertFile, "cert", "etc/cert.pem", "Path to PEM certificate file.")
	flag.StringVar(&KeyFile, "key", "etc/key.pem", "Path to PEM private key file.")

	// Server configs
	flag.StringVar(&Address, "addr", "localhost:8000", "Server listening address, [host]:[port].")
	flag.BoolVar(&GZipEnabled, "gzip", false, "Enable trafic compression.")
	flag.IntVar(&GZipLevel, "gzip-level", 5, "Compression level.")

	flag.Parse()
}
