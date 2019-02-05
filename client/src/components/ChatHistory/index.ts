import { connect } from 'react-redux';

import { Store } from 'src/types';
import ChatHistory from './component';

function mapStateToProps ({ message }: Store) {
  return {
    messages: message.messages,
  };
}

const ConnectedChatHistory = connect(mapStateToProps, {})(ChatHistory);

export default ConnectedChatHistory;
