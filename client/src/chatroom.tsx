import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { Provider } from 'react-redux';

import { Chatroom } from './components/Chatroom';

import store from './store';

ReactDOM.render(
  <Provider store={store}>
    <Chatroom />
  </Provider>,
  document.getElementById('chatroom')
);
