import * as React from 'react';
import { AddMessage } from 'src/actions/message';
import ConnectedChatHistory from 'src/containers/ChatHistory';
import ConnectedChatInput from 'src/containers/ChatInput';
import { Message } from 'src/types';

export interface ChatroomProps {
  wsURL: string;
  addMessage: (msg: Message) => AddMessage;
}

interface ChatroomState {
  timestamp: Date;
  ws: WebSocket;
}

export default class Chatroom extends React.Component<ChatroomProps, ChatroomState> {

  constructor (props: any) {
    super(props);
    this.state = {
      timestamp: new Date(Date.now()),
      ws: this.constructWSConn(),
    };
  }

  public render () {
    return (
      <div>
        <p>Constructed time: {this.state.timestamp.toLocaleString()}</p>
        <ConnectedChatHistory />
        <ConnectedChatInput />
      </div>
    );
  }

  private constructWSConn (): WebSocket {
    const loc = new URL(this.props.wsURL, window.location.href);
    loc.protocol = loc.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = new WebSocket(loc.href);

    // ws.onopen = () => { console.log(`Connected to ${ws.url}`); };
    ws.onmessage = (e: MessageEvent) => {
      const msg = JSON.parse(e.data) as Message;
      this.props.addMessage(msg);
    };

    return ws;
  }

}
