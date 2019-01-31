import { connect } from 'react-redux';

import { Store } from 'src/types';
import ChatHistory from './component';

function mapStateToProps ({ message }: Store) {
  return {
    failedMessages: message.failedMessages,
    messages: message.messages,
    pendingMessages: message.pendingMessages,
  };
}

const ConnectedChatHistory = connect(mapStateToProps, {})(ChatHistory);

export default ConnectedChatHistory;
