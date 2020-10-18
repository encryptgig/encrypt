import { combineReducers } from "redux";
import files from "./fileReducer";

const rootReducer = combineReducers({ files });

export default rootReducer;
