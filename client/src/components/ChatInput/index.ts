import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { addMessage, clearMessages, MessageAction, submit } from 'src/actions/message';
import { Message } from 'src/types';
import ChatInput from './component';

// interface OwnProps {
//   wsURL: string;
// }

function mapDispatchToProps (dispatch: Dispatch<MessageAction>) {
  return {
    addMessage: (m: Message) => dispatch(addMessage(m)),
    clearMessages: () => dispatch(clearMessages()),
    submitMessage: (m: string) => {
      const data = submit(m);
      // ownProps.ws.send(JSON.stringify(data.payload));
      dispatch(data);
    },
  };
}

const ConnectedChatInput = connect(
  null,
  mapDispatchToProps
)(ChatInput);

export default ConnectedChatInput;
