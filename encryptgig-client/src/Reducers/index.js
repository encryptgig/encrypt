import { combineReducers } from "redux";
import files from "./fileReducer";
import user from "./userReducer";
import shareEmail from "./shareEmailReducer";
import spinner from "./spinnerReducer";

const rootReducer = combineReducers({ files, user, shareEmail,spinner });

export default rootReducer;
