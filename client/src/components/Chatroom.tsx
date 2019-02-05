import * as React from 'react';
import History from './History';
import InputBoard from './InputBoard';

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
        <History />
        <InputBoard wsURL={this.props.wsURL} />
      </div>
    );
  }

}
