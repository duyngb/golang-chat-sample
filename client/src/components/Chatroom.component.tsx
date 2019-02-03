import * as React from 'react';
import ConnectedHistory from 'src/components/History.connected';
import ConnectedInputBoard from 'src/components/InputBoard.connected';

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
        <ConnectedHistory />
        <ConnectedInputBoard wsURL={this.props.wsURL} />
      </div>
    );
  }

}
