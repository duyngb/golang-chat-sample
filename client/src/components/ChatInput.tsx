import * as React from "react";
import { SendMessage } from 'src/actions/message';

interface IProps {
  submitMessage: (ws: WebSocket, m: string) => SendMessage;
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
    this.props.submitMessage(this.props.ws, message);
    this.setState({ message: '' });
  }

  public render () {
    return (
      <form onSubmit={this.handleSubmit} >
        <input type="text" name="message" id="message" autoComplete="off"
          value={this.state.message}
          onChange={this.handleChange} />
        <input type="submit" value="Submit"
          disabled={this.props.connectionClosed || !this.state.message}
        />
      </form>
    );
  }
}
