import React from "react";
import { Route } from "react-router-dom";
import { uploadFile } from "./Actions/fileActions";
import { useDispatch } from "react-redux";

function SecretRoute({ component: Component, roles, ...rest }) {
  const dispatch = useDispatch();
  dispatch(uploadFile(null));
  return (
    <Route
      {...rest}
      render={(props) => {
        return <Component {...props} />;
      }}
    />
  );
}

export { SecretRoute };
