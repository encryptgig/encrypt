export function userLogin(email) {
  return { type: "USER_LOGIN", email };
}
export function userLogout() {
  return { type: "USER_LOGOUT" };
}
