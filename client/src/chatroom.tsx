import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import Chatroom from './components/Chatroom';
import { MessagesStore } from './types';
import { MessageAction } from './reducers/messages';
import { message } from './reducers';

const messageStore = createStore<MessagesStore, MessageAction, object, object>(
  message,
  {
    messages: [],
    pendingMessages: [],
    failedMessages: []
  }
)

ReactDOM.render(
  <Provider store={messageStore}>
    <Chatroom />
  </Provider>,
  document.getElementById('chatroom')
);
