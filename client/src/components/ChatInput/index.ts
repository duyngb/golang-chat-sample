import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { addMessage, clearMessages, MessageAction, submit } from 'src/actions/message';
import { Message } from 'src/types';
import ChatInput from './component';

function mapDispatchToProps (dispatch: Dispatch<MessageAction>) {
  return {
    addMessage: (m: Message) => dispatch(addMessage(m)),
    clearMessages: () => dispatch(clearMessages()),
    submitMessage: (m: string) => dispatch(submit(m)),
  };
}

const ConnectedChatInput = connect(
  null,
  mapDispatchToProps
)(ChatInput);

export default ConnectedChatInput;
