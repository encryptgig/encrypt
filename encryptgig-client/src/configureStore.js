import { createStore, applyMiddleware } from "redux";
import rootReducer from "./Reducers";

export default function configureStore(initialState) {
  return createStore(rootReducer, initialState, applyMiddleware());
}

// TODO: add middleware reduxImmutableStateInvarient --> put bracket
// TODO: add compose for redux devtools
