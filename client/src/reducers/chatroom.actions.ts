import { Action } from "redux";

export enum MsgActionType {
  /** Add message to stack. */
  ADD_MSG,
  /** Send message to server. */
  SEND_MSG,
};

export interface MsgAction extends Action<MsgActionType> {
  payload: string
};

export function addMessage (payload: string): MsgAction {
  return {
    type: MsgActionType.ADD_MSG,
    payload: payload
  }
};
