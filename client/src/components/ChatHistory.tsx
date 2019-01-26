import * as React from 'react';
import { Message } from 'src/types';

export interface ChatHistoryProps {
  messages: ReadonlyArray<Message>;
  pendingMessages: ReadonlyArray<Message>;
  failedMessages: ReadonlyArray<Message>;
}

export default class ChatHistory extends React.Component<ChatHistoryProps, object> {
  public render () {
    return (
      <ul className="list-group list-group-flush">
        {this.props.messages.map(m => <li key={m.timestamp}>{m.content}</li>)}
        {this.props.pendingMessages.map(m => <li className="pending" key={m.timestamp}>{m.content}</li>)}
      </ul>
    );
  }
}
