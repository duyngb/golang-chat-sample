package chat

// Event defines custom type for message Event field.
// Each server message MUST containt exactly one event type.
type Event string

// Message event type definitions.
const (
	ClientRegister    Event = "REGI"
	ClientJoined      Event = "JOIN"
	ClientLeaved      Event = "LEAV"
	ClientMessage     Event = "MESS"
	ServerAnnoucement Event = "ANNO"
)

// Frame defines a message structure for each chat packet.
type Frame struct {
	Event     Event  `json:"event"`
	Timestamp int    `json:"timestamp"`
	Content   string `json:"content"`
	Who       string `json:"who"`
}
