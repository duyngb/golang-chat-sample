import * as React from 'react';
import { AddMessage, DClearMessages } from 'src/actions/message';
import ConnectedChatHistory from 'src/components/ChatHistory';
import ConnectedChatInput from 'src/components/ChatInput';
import { E_NULL_EVENT } from 'src/constants';
import { Message } from 'src/types';

interface IProps {
  wsURL: string;
  username?: string;
  addMessage: (msg: Message) => AddMessage;
  clearMessages: () => DClearMessages;
}

const CLIENT_INTERNAL = 'CONNECTOR';

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
      <div className="container">
        <p className="notification">Constructed time: {this.state.timestamp.toLocaleString()}</p>
        <ConnectedChatHistory />
        <div className="debug-tools">
          <p>Testing Zone:</p>
          <button onClick={this.terminate} className="col">Terminate WS</button>
          <button onClick={this.reconnect} className="col">Reconnect WS</button>
          <button onClick={this.broadcastDummyMessages}>Create dummy messages</button>
          <button onClick={this.clearMessages}>Clear messages</button>
        </div>
        <ConnectedChatInput ws={this.state.ws} connectionClosed={this.state.connectionClosed} />
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

    ws.onopen = _ => {
      const msg: Message = {
        content: 'Connected to server.',
        event: E_NULL_EVENT,
        timestamp: Date.now(),
        who: CLIENT_INTERNAL
      };
      this.props.addMessage(msg);

      this.setState({ connectionClosed: false });
    };

    ws.onclose = _ => {
      const msg: Message = {
        content: 'Connection to socket closed.',
        event: E_NULL_EVENT,
        timestamp: Date.now(),
        who: CLIENT_INTERNAL
      };
      this.props.addMessage(msg);
      this.setState({ connectionClosed: true });
    };

    ws.onerror = _ => {
      const msg: Message = {
        content: 'Error when connect to server.',
        event: E_NULL_EVENT,
        timestamp: Date.now(),
        who: CLIENT_INTERNAL
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
    this.props.addMessage({
      content: 'Reconnecting to server...',
      event: E_NULL_EVENT,
      timestamp: Date.now(),
      who: CLIENT_INTERNAL
    });
    const ws = this.constructWSConn();
    this.setState({ ws });
  }

  private broadcastDummyMessages = (_: React.MouseEvent) => {
    for (let i = 0; i < 10; i++) {
      this.props.addMessage({
        content: `Dummy message #${i}`,
        event: E_NULL_EVENT,
        timestamp: Date.now() + 1000 * i,
        who: 'me'
      });
    }
  }

  private clearMessages = (_: React.MouseEvent) => {
    this.props.clearMessages();
  }

}
