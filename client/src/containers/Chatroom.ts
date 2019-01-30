import { connect } from 'react-redux';
import { Dispatch } from 'redux';
import { addMessage, clearMessages, MessageAction } from 'src/actions/message';
import Chatroom from 'src/components/Chatroom';
import { Message } from 'src/types';

function mapDispatchToProps (dispatch: Dispatch<MessageAction>) {
  return {
    addMessage: (m: Message) => dispatch(addMessage(m)),
    clearMessages: () => dispatch(clearMessages())
  };
}

const ConnectedChatroom = connect(
  null,
  mapDispatchToProps
)(Chatroom);

export default ConnectedChatroom;
