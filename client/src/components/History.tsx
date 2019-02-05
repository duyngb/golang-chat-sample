import * as React from 'react';
import { connect } from 'react-redux';
import { CLIENT_MESSAGE } from 'src/constants';
import { Message, Store } from 'src/types';
import MessageLine from './MessageLine';
import NotificationLine from './NotificationLine';

export interface ChatHistoryProps {
  messages: ReadonlyArray<Message>;
}

class PureHistory extends React.Component<ChatHistoryProps, object> {
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

function mapStateToProps ({ message }: Store) {
  return {
    messages: message.messages,
  };
}

const ConnectedHistory = connect(mapStateToProps, {})(PureHistory);

export default ConnectedHistory;
