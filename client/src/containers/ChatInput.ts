import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as actions from 'src/actions/message';
import ChatInput from 'src/components/ChatInput';

function mapDispatchToProps (dispatch: Dispatch<actions.MessageAction>) {
  return {
    submitMessage: (ws: WebSocket, m: string) => {
      const data = actions.submit(m);
      ws.send(JSON.stringify(data.payload));
      dispatch(data);
    }
  };
}

const ConnectedChatInput = connect(
  null,
  mapDispatchToProps
)(ChatInput);

export default ConnectedChatInput;
