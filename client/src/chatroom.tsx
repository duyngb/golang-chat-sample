import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import { MessageAction } from './actions/message';
import Chatroom from './components/Chatroom';
import { message } from './reducers/message';
import { MessagesStore } from './types';

const messageStore = createStore<MessagesStore, MessageAction, object, object>(
  message,
  {
    failedMessages: [],
    messages: [],
    pendingMessages: [],
  }
);

ReactDOM.render(
  <Provider store={messageStore}>
    <Chatroom />
  </Provider>,
  document.getElementById('chatroom')
);
