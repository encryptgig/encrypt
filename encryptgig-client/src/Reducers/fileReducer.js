const fileReducer = (state = { file: null }, action) => {
  switch (action.type) {
    case "UPLOAD_FILE":
      return { file: action.file };
    default:
      return state;
  }
};
export default fileReducer;
