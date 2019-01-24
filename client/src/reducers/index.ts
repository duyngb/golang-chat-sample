import { MsgActionType, MsgAction } from "./chatroom.actions";

export type RootState = {
  messages: ReadonlyArray<string>
}

const initalState: RootState = {
  messages: []
};

function rootReducer (state = initalState, action: MsgAction): RootState {
  switch (action.type) {
    case MsgActionType.ADD_MSG:
      return {
        ...state,
        messages: <ReadonlyArray<string>>state.messages.concat(action.payload)
      }

    default:
      break;
  }

  return state
}

export default rootReducer
