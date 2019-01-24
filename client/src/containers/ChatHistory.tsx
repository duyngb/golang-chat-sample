import { connect } from 'react-redux';

import { MessagesStore } from 'src/types';
import ChatHistory, { ChatHistoryProps } from 'src/components/ChatHistory';

export function mapStateToProps ({ messages, pendingMessages, failedMessages }: MessagesStore): ChatHistoryProps {
  return {
    messages,
    pendingMessages,
    failedMessages
  }
}

const ConnectedChatHistory = connect(mapStateToProps, {})(ChatHistory)

export default ConnectedChatHistory
