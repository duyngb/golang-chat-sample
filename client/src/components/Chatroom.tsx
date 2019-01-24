import * as React from 'react';
import { ConnectedChatInput } from './ChatInput';
import { ConnectedChatMessages } from './ChatMessages';

declare type chatroomState = {
  timestamp: number
}

export class Chatroom extends React.Component {
  state: chatroomState;

  constructor (props: any) {
    super(props);
    this.state = {
      timestamp: Date.now()
    };
  };

  render () {
    return (
      <div>
        <p>{this.state.timestamp}</p>
        <ConnectedChatMessages />
        <ConnectedChatInput />
      </div>
    );
  };

}
