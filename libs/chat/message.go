package chat

// Event defines custom type for message Event field.
// Each server message MUST containt exactly one event type.
type Event int

// Message event type definitions.
const (
	_ Event = iota + 0
	UserRegister
	UserMessage
	ServerAnnoucement
)

// Frame defines a message structure for each chat packet.
type Frame struct {
	Event     Event  `json:"event"`
	Timestamp int    `json:"timestamp"`
	Content   string `json:"content"`
	Who       string `json:"who"`
}
