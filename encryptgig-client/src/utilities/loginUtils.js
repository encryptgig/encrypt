export const validateLogin = () => {
  const wasm = window.WASMGo;
  if (
    localStorage.getItem("accessToken") === null ||
    localStorage.getItem("accessToken").length === 0
  ) {
    return false;
  }
  return true;
};
