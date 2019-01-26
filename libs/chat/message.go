package chat

import (
	"encoding/json"
	"fmt"

	"github.com/gorilla/websocket"
)

// MessageFrame defines message structure for each chat packet.
type MessageFrame struct {
	Timestamp int    `json:"timestamp"`
	Content   string `json:"content"`
	Who       string `json:"who"`
}

func processMessage(connAddr *websocket.Conn, message []byte) ([]byte, error) {
	var m MessageFrame
	err := json.Unmarshal(message, &m)
	if err != nil {
		return nil, err
	}

	// Update MessageFrame.Who field
	m.Who = fmt.Sprintf("%p", connAddr)

	final, err := json.Marshal(&m)
	if err != nil {
		return nil, err
	}
	return final, err
}
