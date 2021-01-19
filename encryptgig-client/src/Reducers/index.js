import { combineReducers } from "redux";
import files from "./fileReducer";
import user from "./userReducer";
import shareEmail from "./shareEmailReducer";
import spinner from "./spinnerReducer";
import showLogin from "./loginReducer";

const rootReducer = combineReducers({
  files,
  user,
  shareEmail,
  spinner,
  showLogin,
});

export default rootReducer;
