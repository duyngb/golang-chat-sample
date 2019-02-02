import * as React from 'react';
import ConnectedChatHistory from 'src/components/ChatHistory';
import ConnectedChatInput from 'src/components/ChatInput';

interface IProps {
  wsURL: string;
}

interface IState {
  timestamp: Date;
}

export default class Chatroom extends React.Component<IProps, IState> {

  constructor (props: any) {
    super(props);
    this.state = {
      timestamp: new Date(Date.now()),
    };
  }

  public render () {
    return (
      <div className="container">
        <p className="notification">Constructed time: {this.state.timestamp.toLocaleString()}</p>
        <ConnectedChatHistory />
        <ConnectedChatInput wsURL={this.props.wsURL} />
      </div>
    );
  }

}
