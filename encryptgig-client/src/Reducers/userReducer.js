const userReducer = (
  state = { email: null, name: null, photoURL: null },
  action
) => {
  switch (action.type) {
    case "USER_LOGIN":
      return {
        email: action.email,
        name: action.name,
        photoURL: action.photoURL,
      };
    case "USER_LOGOUT":
      return { email: null };
    default:
      return state;
  }
};
export default userReducer;
