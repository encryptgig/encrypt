import React from "react";
import { Route, Redirect } from "react-router-dom";
import fire from "./configs/firebase-configs";

function PrivateRoute({ component: Component, roles, ...rest }) {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!localStorage.getItem("accessToken")) {
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
