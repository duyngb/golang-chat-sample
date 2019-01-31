import * as React from 'react';
import { Message } from 'src/types';
import MessagePiece from './Message.component';

export interface ChatHistoryProps {
  messages: ReadonlyArray<Message>;
  pendingMessages: ReadonlyArray<Message>;
  failedMessages: ReadonlyArray<Message>;
}

export default class ChatHistory extends React.Component<ChatHistoryProps, object> {
  public render () {
    return (
      <div className="content messages">
        {this.props.messages.map(m => <MessagePiece key={m.timestamp} message={m} />)}
      </div>
    );
  }
}
