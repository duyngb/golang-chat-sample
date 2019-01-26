import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { createStore } from 'redux';
import Chatroom from './components/Chatroom';
import rootReducer from './reducers';
import { MessagesStore } from './types';

/** The only store for this application. */
const store = createStore(
  rootReducer,
  {
    message: {
      failedMessages: [],
      messages: [],
      pendingMessages: [],
    } as MessagesStore
  }
);

ReactDOM.render(
  <Provider store={store}>
    <Chatroom />
  </Provider>,
  document.getElementById('chatroom')
);
