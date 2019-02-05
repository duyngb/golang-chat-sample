import * as React from 'react';
import { connect } from 'react-redux';
import { CLIENT_MESSAGE } from 'src/constants';
import { Message, Store } from 'src/types';
import MessageLine from './MessageLine';
import NotificationLine from './NotificationLine';

interface IProps {
  messages: ReadonlyArray<Message>;
}

interface IState {
  autoscrollEnabled: boolean;
}

class PureHistory extends React.Component<IProps, IState> {
  constructor (props: IProps) {
    super(props);

    this.state = {
      autoscrollEnabled: true
    };

  }
  public render () {
    return (
      <div className="messages" >
        <div className="content" onScroll={this.scrollSpy}>
          {this.props.messages.map(m => {
            if (m.event === CLIENT_MESSAGE) {
              return <MessageLine key={`${m.who}$${m.timestamp}`} message={m} />;
            }
            return <NotificationLine key={`${m.who}$${m.timestamp}`} message={m} />;
          })}
        </div>

        {!this.state.autoscrollEnabled &&
          <div className="float tag is-info"
            onClick={this.scrollToLast}>Scroll to last</div>}

      </div>
    );
  }

  public componentDidUpdate () {
    // Only trigger autoscroll if enabled
    if (this.state.autoscrollEnabled) { this._scrollToLast(); }
  }

  private scrollSpy: React.UIEventHandler<HTMLDivElement> = e => {
    const containerBtm = e.currentTarget.getBoundingClientRect().bottom;
    const last = document.querySelector('.content > :last-child');
    if (!last) {
      // Force auto scroll state to true and return
      this.setState({ autoscrollEnabled: true });
      return;
    }
    const lastTop = last.getBoundingClientRect().top;
    const lastBtm = last.getBoundingClientRect().bottom;

    if (this.state.autoscrollEnabled && lastTop > containerBtm) {
      this.setState({ autoscrollEnabled: false });
      return;
    }

    if (!this.state.autoscrollEnabled && lastBtm < containerBtm) {
      this.setState({ autoscrollEnabled: true });
      return;
    }

  }

  private scrollToLast: React.MouseEventHandler<HTMLDivElement> = _ => {
    this._scrollToLast();
    this.setState({ autoscrollEnabled: true });
  }

  private _scrollToLast () {
    // Query last message item
    const last = document.querySelector('.content > :last-child');
    if (!last) { return; }
    last.scrollIntoView();
  }
}

function mapStateToProps ({ message }: Store): IProps {
  return {
    messages: message.messages,
  };
}

const History = connect(mapStateToProps, {})(PureHistory);

export default History;
