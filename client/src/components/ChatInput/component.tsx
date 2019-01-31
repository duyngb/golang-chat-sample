import * as React from "react";
import { SendMessage } from 'src/actions/message';

interface IProps {
  submitMessage: (m: string) => SendMessage;
  ws: WebSocket;
  connectionClosed: boolean;
}

interface IState {
  message: string;
}

export default class ChatInput extends React.Component<IProps, IState> {

  constructor (props: any) {
    super(props);

    this.state = { message: '' };

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
      <form onSubmit={this.handleSubmit} className="field has-addons message-input">
        <div className="control">
          <input type="text" className="input" id="username" autoComplete="off" />
        </div>
        <div className="control is-expanded">
          <input className="input" type="text" name="message" id="message" autoComplete="off"
            placeholder="Broadcast your voice."
            value={this.state.message}
            onChange={this.handleChange} />
        </div>
        <div className="control">
          <input className="button is-success" type="submit" value="SEND"
            disabled={this.props.connectionClosed || !this.state.message} />
        </div>
      </form>
    );
  }
}
