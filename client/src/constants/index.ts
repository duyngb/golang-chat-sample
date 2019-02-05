export const ADD_MESSAGE = 'ADD_MESSAGE';
export type ADD_MESSAGE = typeof ADD_MESSAGE;

export const SEND_MESSAGE = 'SEND_MESSAGE';
export type SEND_MESSAGE = typeof SEND_MESSAGE;

export const SEND_STATUS = 'SENT_STATUS';
export type SEND_STATUS = typeof SEND_STATUS;

export const CLEAR_MESSAGES = 'CLEAR_MESSAGES';
export type CLEAR_MESSAGES = typeof CLEAR_MESSAGES;

export const CLIENT_EVENT = 'CLIENT_EVENT';
export type CLIENT_EVENT = typeof CLIENT_EVENT;

export const CLIENT_REGISTER = 'REGI';
export type CLIENT_REGISTER = typeof CLIENT_REGISTER;

export const CLIENT_JOINED = 'JOIN';
export type CLIENT_JOINED = typeof CLIENT_JOINED;

export const CLIENT_LEAVED = 'LEAV';
export type CLIENT_LEAVED = typeof CLIENT_LEAVED;

export const CLIENT_MESSAGE = 'MESS';
export type CLIENT_MESSAGE = typeof CLIENT_MESSAGE;

export const SERVER_ANNOUNCE = 'ANNO';
export type SERVER_ANNOUNCE = typeof SERVER_ANNOUNCE;

/** Internal events */
export type InternalEvent = CLIENT_EVENT;

/** This client message send to server */
export type SelfEvent = (
  | CLIENT_REGISTER
  | CLIENT_MESSAGE
);

/** Server annoucement events */
export type ServerEvent = (
  | CLIENT_JOINED
  | CLIENT_LEAVED
  | SERVER_ANNOUNCE
);

export type MessageEvent = (
  | InternalEvent
  | SelfEvent
  | ServerEvent
);
