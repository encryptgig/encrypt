import { combineReducers } from "redux";
import files from "./fileReducer";
import user from "./userReducer";
import shareEmail from "./shareEmailReducer";

const rootReducer = combineReducers({ files, user, shareEmail });

export default rootReducer;
