import React, { useState, useEffect } from "react";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import EgDrawer from "./components/EgDrawer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EncryptData from "./pages/EncryptData";
import EncryptCSV from "./pages/EncryptCSV";
import { createBrowserHistory } from "history";
import { useDispatch, useSelector } from "react-redux";
import { PrivateRoute } from "./PrivateRoutes";
import EncryptFile from "./pages/EncryptFile";
import { Helmet } from "react-helmet";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const history = createBrowserHistory();
  const [inst, setInst] = useState(null);

  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      //dispatch(alertActions.clear());
    });
    loadWasm();
  }, []);

  const loadWasm = async () => {
    const go = new window.Go();
    let inst;
    WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then(
      (result) => {
        go.run(result.instance);
        setInst(result.instance);
      }
    );
  };

  return (
    <div>
      <EgDrawer />
      <Switch>
        <PrivateRoute exact path="/EncryptData" component={EncryptData} />
        <PrivateRoute exact path="/EncryptFile" component={EncryptFile} />
        <PrivateRoute exact path="/EncryptCSV" component={EncryptCSV} />
        <Route path="/Login" component={Login} />
        <Route path="/Register" component={Register} />
        <Redirect from="*" to="/" />
      </Switch>
    </div>
  );
}

export default App;
