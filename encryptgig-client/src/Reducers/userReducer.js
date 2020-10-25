const userReducer = (state = { email: null }, action) => {
  switch (action.type) {
    case "USER_LOGIN":
      return { email: action.email };
    case "USER_LOGOUT":
      return { email: null };
    default:
      return state;
  }
};
export default userReducer;
