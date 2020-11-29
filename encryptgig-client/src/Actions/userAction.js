export function userLogin(email, name, photoURL) {
  return { type: "USER_LOGIN", email, name, photoURL };
}
export function userLogout() {
  return { type: "USER_LOGOUT" };
}
