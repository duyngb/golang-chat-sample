import * as constants from 'src/constants';
import { Message } from 'src/types';

export interface AddMessage {
  type: constants.ADD_MESSAGE;
  payload: Message;
}

export interface SendMessage {
  type: constants.SEND_MESSAGE;
  payload: Message;
}

export interface SentStatus {
  type: constants.SEND_STATUS;
  payload: Message;
  success: boolean;
}

/**
 * MessageAction type is an action related to manage message state
 * in current chat log.
 *
 * All action type are defined in {@link constants}.
 */
export type MessageAction = (
  AddMessage |
  SendMessage |
  SentStatus
);

export function submit (message: string): SendMessage {
  return {
    payload: {
      content: message,
      timestamp: Date.now(),
      who: 'me'
    },
    type: constants.SEND_MESSAGE
  };
}
