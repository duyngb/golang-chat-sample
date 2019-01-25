import { connect } from 'react-redux';
import { Dispatch } from 'redux';

import * as actions from 'src/actions/message';
import ChatInput, { ChatInputProps } from 'src/components/ChatInput';

function mapDispatchToProps (d: Dispatch<actions.MessageAction>): ChatInputProps {
  return {
    submitMessage: (m: string) => d(actions.submit(m))
  };
}

const ConnectedChatInput = connect(
  null,
  mapDispatchToProps
)(ChatInput);

export default ConnectedChatInput;
