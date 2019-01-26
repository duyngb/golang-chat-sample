import { MessageAction } from 'src/actions/message';
import { ADD_MESSAGE, SEND_MESSAGE, SEND_STATUS } from 'src/constants';
import { Message, MessagesStore as MessagesState } from 'src/types';

const InitialMessagesState: MessagesState = {
  failedMessages: [],
  messages: [],
  pendingMessages: []
};

/** Message reducer returns new state object based on dispatched action type. */
export function messageReducer (state: MessagesState = InitialMessagesState, action: MessageAction): MessagesState {
  switch (action.type) {
    case ADD_MESSAGE:
      if (action.payload) {
        return {
          ...state,
          messages: push(state.messages, action.payload)
        };
      }
      break;
    case SEND_MESSAGE:
      return {
        ...state,
        pendingMessages: push(state.pendingMessages, action.payload)
      };
    case SEND_STATUS:
      if (action.success) {
        return {
          ...state,
          messages: state.messages.concat(state.pendingMessages),
          pendingMessages: pop(state.pendingMessages, action.payload),
        };
      } else {
        return {
          ...state,
          failedMessages: push(state.failedMessages, action.payload),
          pendingMessages: pop(state.pendingMessages, action.payload),
        };
      }
    default: break;
  }

  return state;
}

// Helpers

/**
 * Combine source array with new item. Returns modifed array.
 * @param source - Source array data
 * @param item  - New item to add
 */
function push (source: ReadonlyArray<Message>, item: Message | ConcatArray<Message>) {
  return source.concat(item) as ReadonlyArray<Message>;
}

/**
 * Remove `item` from source array. Returns modifed array.
 * @param source - Source array data
 * @param item - Item to remove
 */
function pop (source: ReadonlyArray<Message>, item: Message) {
  return source.filter(i => i !== item) as ReadonlyArray<Message>;
}
