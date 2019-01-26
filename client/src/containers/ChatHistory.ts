import { connect } from 'react-redux';

import ChatHistory, { ChatHistoryProps } from 'src/components/ChatHistory';
import { Store } from 'src/types';

function mapStateToProps ({ message }: Store): ChatHistoryProps {
  return {
    failedMessages: message.failedMessages,
    messages: message.messages,
    pendingMessages: message.pendingMessages,
  };
}

const ConnectedChatHistory = connect(mapStateToProps, {})(ChatHistory);

export default ConnectedChatHistory;
