import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore } from 'redux';
import Chatroom from './components/Chatroom';
import rootReducer from './reducers';

/** The only store for this application. */
const store = createStore(
  rootReducer,
  {
    message: {
      failedMessages: [],
      messages: [],
      pendingMessages: [],
    }
  }
);

ReactDOM.render(
  <Provider store={store}>
    <Chatroom wsURL="/chatroom/ws" />
  </Provider>,
  document.getElementById('chatroom')
);
