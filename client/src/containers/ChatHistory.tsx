import { connect } from 'react-redux';

import ChatHistory, { ChatHistoryProps } from 'src/components/ChatHistory';
import { MessagesStore } from 'src/types';

export function mapStateToProps ({ messages, pendingMessages, failedMessages }: MessagesStore): ChatHistoryProps {
  return {
    failedMessages,
    messages,
    pendingMessages,
  };
}

const ConnectedChatHistory = connect(mapStateToProps, {})(ChatHistory);

export default ConnectedChatHistory;
