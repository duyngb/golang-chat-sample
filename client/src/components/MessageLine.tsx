import * as React from 'react';
import { Message } from 'src/types';

interface IProps {
  message: Message;
}

export default class MessageLine extends React.Component<IProps, object> {
  public render () {
    return (
      <div className="message-piece" data-sender={this.props.message.who}>
        <span className="tag is-dark">{this.props.message.who}</span>
        &nbsp;{this.props.message.content}
      </div>
    );
  }
}
