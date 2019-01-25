import * as React from 'react';
import ConnectedChatHistory from 'src/containers/ChatHistory';
import ConnectedChatInput from 'src/containers/ChatInput';

interface ChatroomState {
  timestamp: Date;
}

export default class Chatroom extends React.Component<object, ChatroomState> {
  // state: ChatroomState

  constructor (props: any) {
    super(props);
    this.state = {
      timestamp: new Date(Date.now())
    };
  }

  public render () {
    return (
      <div>
        <p>Constructed time: {this.state.timestamp.toLocaleString()}</p>
        <ConnectedChatHistory />
        <ConnectedChatInput />
      </div>
    );
  }

}
