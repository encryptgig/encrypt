const loginReducer = (state = { showLogin: false }, action) => {
  switch (action.type) {
    case "SHOW_LOGIN":
      return { showLogin: action.showLogin };
    default:
      return state;
  }
};
export default loginReducer;
