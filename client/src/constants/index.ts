export const ADD_MESSAGE = 'ADD_MESSAGE';
export type ADD_MESSAGE = typeof ADD_MESSAGE;

export const SEND_MESSAGE = 'SEND_MESSAGE';
export type SEND_MESSAGE = typeof SEND_MESSAGE;

export const SEND_STATUS = 'SENT_STATUS';
export type SEND_STATUS = typeof SEND_STATUS;

export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export type CLEAR_MESSAGES = typeof CLEAR_MESSAGES;

export const E_NULL_EVENT = 0;
export type E_NULL_EVENT = typeof E_NULL_EVENT;

export const E_USER_REGISTER = 1;
export type E_USER_REGISTER = typeof E_USER_REGISTER;

export const E_USER_MESSAGE = 2;
export type E_USER_MESSAGE = typeof E_USER_MESSAGE;

export type MessageEvent = (
  | E_NULL_EVENT
  | E_USER_REGISTER
  | E_USER_MESSAGE
);
