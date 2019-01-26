import { combineReducers } from "redux";
import { messageReducer } from './message';

/**
 * The root reducer is combined from multiple atomic reducers
 * based on each action group.
 */
const rootReducer = combineReducers({
  message: messageReducer
});

export default rootReducer;
