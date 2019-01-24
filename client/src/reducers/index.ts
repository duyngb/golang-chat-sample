import { MsgActionType, MsgAction } from "./messages";

export type RootState = {
  messages: ReadonlyArray<string>
}

const initalState: RootState = {
  messages: []
};

export default function rootReducer (state = initalState, action: MsgAction): RootState {
  switch (action.type) {
    case MsgActionType.ADD_MSG:
      if (action.payload) return {
        ...state,
        messages: state.messages.concat(action.payload)
      }

    default:
      break;
  }

  return state
}
