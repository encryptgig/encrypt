import React from "react";
import { Route, Redirect } from "react-router-dom";
import { uploadFiles } from "./Actions/fileActions";
import { useDispatch } from "react-redux";

function PrivateRoute({ component: Component, roles, ...rest }) {
  const dispatch = useDispatch();
  dispatch(uploadFiles(null));
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!localStorage.getItem("accessToken")) {
          //getSystemStatus
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              to={{ pathname: "/Login", state: { from: props.location } }}
            />
          );
        }

        // logged in so return component
        return <Component {...props} />;
      }}
    />
  );
}

export { PrivateRoute };
