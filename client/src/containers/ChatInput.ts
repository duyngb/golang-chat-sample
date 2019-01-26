import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as actions from 'src/actions/message';
import ChatInput from 'src/components/ChatInput';

function mapDispatchToProps (d: Dispatch<actions.MessageAction>) {
  return {
    submitMessage: (m: string) => d(actions.submit(m))
  };
}

const ConnectedChatInput = connect(
  null,
  mapDispatchToProps
)(ChatInput);

export default ConnectedChatInput;
