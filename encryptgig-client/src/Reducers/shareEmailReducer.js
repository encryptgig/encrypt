const shareEmailReducer = (state = { emailList: null }, action) => {
  switch (action.type) {
    case "SHARE_FILE":
      return { emailList: action.emailList };
    default:
      return state;
  }
};
export default shareEmailReducer;
