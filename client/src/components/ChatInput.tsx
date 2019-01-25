import * as React from "react";
import { SendMessage } from 'src/actions/message';

export interface ChatInputProps {
  submitMessage: (m: string) => SendMessage;
}

export default class ChatInput extends React.Component<ChatInputProps> {
  public state: {
    message: string
  };

  constructor (props: any) {
    super(props);

    this.state = {
      message: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  public handleChange (event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.value });
  }

  public handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { message } = this.state;
    this.props.submitMessage(message);
    this.setState({ message: '' });
  }

  public render () {
    return (
      <form onSubmit={this.handleSubmit} >
        <input type="text" name="message" id="message"
          value={this.state.message}
          onChange={this.handleChange} />
        <input type="submit" value="Submit" disabled={!this.state.message} />
      </form>
    );
  }
}
