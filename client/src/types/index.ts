/**
 * Message represent a message piece exchanged with server.
 */
export interface Message {
  timestamp: number,
  who?: string,
  content: string
}

/**
 * MessagesStore interface is consumed mainly by the chat app
 * to display sent and received messages.
 */
export interface MessagesStore {
  /** Message stack. */
  messages: ReadonlyArray<Message>
  /** Messages sending to server and waiting for response. */
  pendingMessages: ReadonlyArray<Message>
  /** Messages failed to send, and should be marked to resend or delete. */
  failedMessages: ReadonlyArray<Message>
}
