import { Action } from "redux";

export const enum MsgActionType {
  /** Add message to stack. */
  ADD_MSG = 'ADD_MSG',
  /** Send message to server. */
  SEND_MSG = 'SEND_MSG',
};

export interface MsgAction<T = MsgActionType> extends Action {
  type: T
  payload: string
};

export function addMessage (payload: string): MsgAction<MsgActionType.ADD_MSG> {
  return {
    type: MsgActionType.ADD_MSG,
    payload: payload
  }
};
