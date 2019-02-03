package log

import (
	"example.com/socket-server/libs/vars"
	"github.com/labstack/gommon/log"
)

// NewLogger returns logger with prefix.
func NewLogger(prefix string) *log.Logger {

	logger := log.New(prefix)

	logger.SetHeader(vars.LogHeader)

	if vars.IsDebug {
		logger.SetLevel(log.DEBUG)
	} else {
		logger.SetLevel(log.INFO)
	}

	return logger
}

// UpdateLogger updates already created logger.
func UpdateLogger(l *log.Logger) {
    l.SetHeader(vars.LogHeader)

    if vars.IsDebug {
        l.SetLevel(log.DEBUG)
    } else {
        l.SetLevel(log.INFO)
    }
}
