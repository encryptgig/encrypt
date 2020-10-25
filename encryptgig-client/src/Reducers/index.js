import { combineReducers } from "redux";
import files from "./fileReducer";
import user from "./userReducer";

const rootReducer = combineReducers({ files, user });

export default rootReducer;
