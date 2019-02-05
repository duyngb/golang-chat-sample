import * as React from 'react';
import * as c from 'src/constants';
import { Message } from 'src/types';

const T_INFO = 'info';
const T_WARN = 'warning';
const T_ERRO = 'error';

type T_INFO = typeof T_INFO;
type T_WARN = typeof T_WARN;
type T_ERRO = typeof T_ERRO;

type NOTI_TYPE = T_INFO | T_WARN | T_ERRO;

interface IProps {
  message: Message;
}

interface IState {
  message: string;
  secondaryMessage: string;
  type: NOTI_TYPE;
}

export default class NotificationLine extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);

    let message = props.message.content;
    let secondaryMessage = '';
    let type: NOTI_TYPE = T_INFO;

    switch (props.message.event) {
      case c.CLIENT_JOINED:
        secondaryMessage = props.message.content;
        message = 'New client joined.';
        break;
      case c.CLIENT_LEAVED:
        secondaryMessage = props.message.content;
        message = 'Client leaved.';
        type = T_WARN;
        break;
      default:
        break;
    }

    this.state = {
      message,
      secondaryMessage,
      type,
    };

  }
  public render () {
    return (
      <div className="inline-notification has-text-centered">
        <span className="tag is-dark">{this.props.message.who}</span>
        {this.state.secondaryMessage &&
          <span className="tag is-secondary uname">{this.state.secondaryMessage}</span>}
        <span className={`tag is-${this.state.type}`}>
          {this.state.message}
        </span>
      </div>
    );
  }
}
