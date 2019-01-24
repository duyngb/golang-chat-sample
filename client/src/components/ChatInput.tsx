import * as React from "react";
import { connect } from 'react-redux';
import { addMessage, MsgAction } from "../reducers/chatroom.actions";
import { Dispatch } from "redux";

function mapDispatchToProps (dispatch: Dispatch) {
  return {
    addMessage: (msg: string) => dispatch(addMessage(msg))
  }
}

type ChatInputProps = {
  addMessage: (msg: string) => MsgAction
}

class ChatInputComp extends React.Component<ChatInputProps> {
  state: {
    message: string
  }

  constructor (props: any) {
    super(props)

    this.state = {
      message: ''
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
  };

  handleChange (event: React.ChangeEvent<HTMLInputElement>) {
    this.setState({ [event.target.name]: event.target.value });
  }

  handleSubmit (e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const { message } = this.state;
    this.props.addMessage(message);
    this.setState({ message: '' });
  }

  render () {
    return (
      <form onSubmit={this.handleSubmit} >
        <input type="text" name="message" id="message"
          value={this.state.message}
          onChange={this.handleChange} />
        <input type="submit" value="Submit" />
      </form>
    );
  };
};


export const ConnectedChatInput = connect(
  null,
  mapDispatchToProps
)(ChatInputComp);
