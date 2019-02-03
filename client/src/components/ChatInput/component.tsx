import * as React from "react";
import { SendMessage } from 'src/actions/message';
import { AddMessage, DClearMessages } from 'src/actions/message';
import { CLIENT_EVENT, CLIENT_MESSAGE, CLIENT_REGISTER } from 'src/constants';
import { Message } from 'src/types';

const CLIENT_INTERNAL = 'CONNECTOR';

interface IProps {
  wsURL: string;
  submitMessage: (m: string) => SendMessage;
  addMessage: (msg: Message) => AddMessage;
  clearMessages: () => DClearMessages;
}

interface IState {
  connectionClosed: boolean;
  message: string;
  registered: boolean;
  username: string;
  ws: WebSocket;
}

export default class ChatInput extends React.Component<IProps, IState> {

  constructor (props: any) {
    super(props);

    this.state = {
      connectionClosed: true,
      message: '',
      registered: false,
      username: '',
      ws: this.constructWSConn(),
    };
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

        {!this.state.registered &&
          // Not registered
          <form className="field has-addons"
            onSubmit={this.registerUsername}>
            <div className="control is-expanded">
              <input type="text" name="username" id="username"
                autoComplete="off"
                placeholder="Your display name"
                maxLength={30}
                disabled={this.state.connectionClosed}
                value={this.state.username}
                onChange={this.handleUsernameChange}
                className="input" />
            </div>
            <div className="control">
              <input type="submit" value="Show my name"
                disabled={!this.state.username || this.state.connectionClosed}
                className="button is-primary" />
            </div>
          </form>}

        {this.state.registered &&
          // Registered state implicitly has available connection.
          <form onSubmit={this.handleSubmit}>
            <div className="field">
              <span className="has-text-light">Broadcast under name&nbsp;</span>
              <span className="tag is-light">{this.state.username}</span>
            </div>
            <div className="field has-addons">
              <div className="control is-expanded">
                <input type="text" name="message" id="message"
                  autoComplete="off"
                  placeholder="Broadcast your voice."
                  className="input"
                  value={this.state.message}
                  onChange={this.handleChange}
                  disabled={!this.state.registered} />
              </div>
              <div className="control">
                <input type="submit" id="submit" value="SEND"
                  className="button is-success"
                  disabled={!this.state.message} />
              </div>
            </div>
          </form>}

      </div>
    );
  }

  private handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ message: e.target.value });
  }

  private handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const { message } = this.state;
    const d = this.props.submitMessage(message);

    this.state.ws.send(JSON.stringify(d.payload));

    this.setState({ message: '' });
  }

  private handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ username: e.target.value });
  }

  private registerUsername = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const m: Message = {
      content: this.state.username,
      event: CLIENT_REGISTER,
      timestamp: Date.now(),
      who: this.state.username
    };

    this.state.ws.send(JSON.stringify(m));
    this.setState({ registered: true });
  }

  private constructWSConn (): WebSocket {
    const loc = new URL(this.props.wsURL, window.location.href);
    loc.protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(loc.href);

    ws.onmessage = e => {
      const msg = JSON.parse(e.data) as Message;
      this.props.addMessage(msg);
    };

    ws.onopen = this.sockOpenHandler;
    ws.onclose = this.sockCloseHandler;
    ws.onerror = this.sockErrorHandler;

    return ws;
  }

  private sockOpenHandler = (_: Event) => {
    const msg: Message = {
      content: 'Connected to server.',
      event: CLIENT_EVENT,
      timestamp: Date.now(),
      who: CLIENT_INTERNAL
    };
    this.props.addMessage(msg);

    this.setState({ connectionClosed: false });
  }

  private sockCloseHandler = (_: CloseEvent) => {
    const msg: Message = {
      content: 'Connection to server closed.',
      event: CLIENT_EVENT,
      timestamp: Date.now(),
      who: CLIENT_INTERNAL
    };
    this.props.addMessage(msg);
    this.setState({ connectionClosed: true, registered: false });
  }

  private sockErrorHandler = (_: Event) => {
    const msg: Message = {
      content: 'Error when connect to server.',
      event: CLIENT_EVENT,
      timestamp: Date.now(),
      who: CLIENT_INTERNAL
    };
    this.props.addMessage(msg);
  }

  private closeSockConn = () => new Promise((resolve, reject) => {
    this.state.ws.close(1000);

    // Reject if could not close sock conn after 5s.
    const t = setTimeout(() => reject(), 5000);
    // Check connection state every 10ms.
    const i = setInterval((ws: WebSocket) => {
      if (ws.readyState === WebSocket.CLOSED) {
        clearTimeout(t);
        clearTimeout(i);
        return resolve();
      }
    }, 10, this.state.ws);
  })

  private terminate = (e: React.MouseEvent) => {
    const target = e.currentTarget;
    target.classList.add('is-loading');
    this.closeSockConn()
      .catch(() => this.props.addMessage({
        content: 'Failed to close connection to server.',
        event: CLIENT_EVENT,
        timestamp: Date.now(),
        who: CLIENT_INTERNAL
      }))
      .then(() => target.classList.remove('is-loading'));
  }

  private reconnect = (e: React.MouseEvent<HTMLButtonElement>) => {
    const target = e.currentTarget;
    target.classList.add('is-loading');

    this.closeSockConn()
      .then(() => {
        this.props.addMessage({
          content: 'Reconnecting to server...',
          event: CLIENT_EVENT,
          timestamp: Date.now(),
          who: CLIENT_INTERNAL
        });
        const ws = this.constructWSConn();
        this.setState({ ws });
      })
      .catch(() => this.props.addMessage({
        content: 'Failed to alter connection to server.',
        event: CLIENT_EVENT,
        timestamp: Date.now(),
        who: CLIENT_INTERNAL
      }))
      .then(() => target.classList.remove('is-loading'));
  }

  private broadcastDummyMessages = (_: React.MouseEvent) => {
    for (let i = 0; i < 10; i++) {
      this.props.addMessage({
        content: `Dummy message #${i}`,
        event: CLIENT_MESSAGE,
        timestamp: Date.now() + 1000 * i,
        who: 'me'
      });
    }
  }

  private clearMessages = (_: React.MouseEvent) => {
    this.props.clearMessages();
  }
}
