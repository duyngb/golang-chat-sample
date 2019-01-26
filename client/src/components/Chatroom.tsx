import * as React from 'react';
import { AddMessage } from 'src/actions/message';
import ConnectedChatHistory from 'src/containers/ChatHistory';
import ConnectedChatInput from 'src/containers/ChatInput';
import { Message } from 'src/types';

interface IProps {
  wsURL: string;
  addMessage: (msg: Message) => AddMessage;
}

interface IState {
  timestamp: Date;
  ws: WebSocket;
  connectionClosed: boolean;
}

export default class Chatroom extends React.Component<IProps, IState> {

  constructor (props: any) {
    super(props);
    this.state = {
      connectionClosed: true,
      timestamp: new Date(Date.now()),
      ws: this.constructWSConn(),
    };
  }

  public render () {
    return (
      <div>
        <p>Constructed time: {this.state.timestamp.toLocaleString()}</p>
        <ConnectedChatHistory />
        <ConnectedChatInput ws={this.state.ws} connectionClosed={this.state.connectionClosed} />
        <hr />
        <div>
          <p>Testing Zone:</p>
          <button onClick={this.terminate}>Terminate WS</button>
          <button onClick={this.reconnect}>Reconnect WS</button>
        </div>
      </div>
    );
  }

  private constructWSConn (): WebSocket {
    const loc = new URL(this.props.wsURL, window.location.href);
    loc.protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(loc.href);

    ws.onmessage = e => {
      const msg = JSON.parse(e.data) as Message;
      this.props.addMessage(msg);
    };
    ws.onopen = _ => { this.setState({ connectionClosed: false }); };
    ws.onclose = _ => {
      const msg: Message = {
        content: 'Connection to socket closed.',
        timestamp: Date.now(),
        who: 'CONNECTION'
      };
      this.props.addMessage(msg);
      this.setState({ connectionClosed: true });
    };
    ws.onerror = _ => {
      const msg: Message = {
        content: 'Error when connect to server.',
        timestamp: Date.now(),
        who: 'CONNECTION'
      };
      this.props.addMessage(msg);
    };

    return ws;
  }

  private terminate = (_: React.MouseEvent) => {
    this.state.ws.close(1000);
  }

  private reconnect = (_: React.MouseEvent) => {
    if (this.state.ws.readyState <= WebSocket.OPEN) {
      this.terminate(_);
    }
    const ws = this.constructWSConn();
    this.setState({ ws });
  }

}
