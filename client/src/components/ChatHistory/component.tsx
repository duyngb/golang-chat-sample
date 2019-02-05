import * as React from 'react';
import { CLIENT_MESSAGE } from 'src/constants';
import { Message } from 'src/types';
import MessageLine from '../MessageLine/component';
import NotificationLine from '../NotificationLine/component';

export interface ChatHistoryProps {
  messages: ReadonlyArray<Message>;
}

export default class ChatHistory extends React.Component<ChatHistoryProps, object> {
  public render () {
    return (
      <div className="content messages">
        {this.props.messages.map(m => {
          if (m.event === CLIENT_MESSAGE) {
            return <MessageLine key={m.timestamp} message={m} />;
          } else {
            return <NotificationLine key={m.timestamp} message={m} />;
          }
        })}
      </div>
    );
  }
}
