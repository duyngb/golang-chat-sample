import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import { MessageAction, submit } from 'src/actions/message';
import ChatInput from 'src/components/ChatInput';

interface OwnProps {
  ws: WebSocket;
  connectionClosed: boolean;
}

function mapDispatchToProps (dispatch: Dispatch<MessageAction>, ownProps: OwnProps) {
  return {
    submitMessage: (m: string) => {
      const data = submit(m);
      ownProps.ws.send(JSON.stringify(data.payload));
      dispatch(data);
    }
  };
}

const ConnectedChatInput = connect(
  null,
  mapDispatchToProps
)(ChatInput);

export default ConnectedChatInput;
