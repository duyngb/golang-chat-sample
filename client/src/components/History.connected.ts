import { connect } from 'react-redux';

import { Store } from 'src/types';
import History from './History.component';

function mapStateToProps ({ message }: Store) {
  return {
    messages: message.messages,
  };
}

const ConnectedHistory = connect(mapStateToProps, {})(History);

export default ConnectedHistory;
