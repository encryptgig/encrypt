export function userLogin(email, name, photoURL) {
  return { type: "USER_LOGIN", email, name, photoURL };
}
export function showSpinner(show){
  return {type:"SHOW_SPINNER", show};
}
export function userLogout() {
  return { type: "USER_LOGOUT" };
}
