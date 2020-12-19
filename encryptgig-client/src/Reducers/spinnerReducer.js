const spinnerReducer = (
    state = { show:false },
    action
  ) => {
    switch (action.type) {
      case "SHOW_SPINNER":
        return { show: action.show };
      default:
        return state;
    }
  };
  export default spinnerReducer;
  