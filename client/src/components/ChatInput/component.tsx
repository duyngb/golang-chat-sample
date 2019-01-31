import * as React from "react";
import { SendMessage } from 'src/actions/message';
import { AddMessage, DClearMessages } from 'src/actions/message';
import { E_NULL_EVENT } from 'src/constants';
import { Message } from 'src/types';

const CLIENT_INTERNAL = 'CONNECTOR';

interface IProps {
  wsURL: string;
  submitMessage: (m: string) => SendMessage;
  addMessage: (msg: Message) => AddMessage;
  clearMessages: () => DClearMessages;
}

interface IState {
  message: string;
  ws: WebSocket;
  connectionClosed: boolean;
  username: string;
}

export default class ChatInput extends React.Component<IProps, IState> {

  constructor (props: any) {
    super(props);

    this.state = {
      connectionClosed: true,
      message: '',
      username: '',
      ws: this.constructWSConn(),
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public handleChange (event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ message: event.target.value });
  }

  public handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { message } = this.state;
    this.props.submitMessage(message);
    this.setState({ message: '' });
  }

  public render () {
    return (
      <div className="message-input">

        <div className="debug-tools buttons has-addons">
          <button className="button is-small"
            onClick={this.terminate} >Terminate WS</button>
          <button className="button is-small"
            onClick={this.reconnect} >Reconnect WS</button>
          <button className="button is-small"
            onClick={this.broadcastDummyMessages} >Create dummy messages</button>
          <button className="button is-small"
            onClick={this.clearMessages} >Clear messages</button>
        </div>

        <form onSubmit={this.handleSubmit} className="field has-addons">
          <div className="control">
            <input type="text" name="username" id="username"
              autoComplete="off"
              className="input" />
          </div>
          <div className="control is-expanded">
            <input type="text" name="message" id="message"
              autoComplete="off"
              placeholder="Broadcast your voice."
              className="input"
              value={this.state.message}
              onChange={this.handleChange} />
          </div>
          <div className="control">
            <input type="submit" value="SEND"
              className="button is-success"
              disabled={this.state.connectionClosed || !this.state.message} />
          </div>
        </form>

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
