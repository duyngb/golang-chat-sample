import * as React from 'react';

import { RootState } from '../reducers';
import { connect } from 'react-redux';

const mapStateToProps = (state: RootState) => {
  return { messages: state.messages }
}

export type MessagesListProps = {
  messages: ReadonlyArray<string>
}

class ChatMessages extends React.Component<MessagesListProps> {
  render () {
    return (
      <ul className="list-group list-group-flush">
        {this.props.messages.map((m, id) => (
          <li key={id}> {m} </li>
        ))}
      </ul>
    )
  }
};

export const ConnectedChatMessages = connect(
  mapStateToProps
)(ChatMessages);
