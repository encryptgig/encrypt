import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import EgDrawer from "./components/EgDrawer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EncryptData from "./pages/EncryptData";
import EncryptCSV from "./pages/EncryptCSV";
import { createBrowserHistory } from "history";
import { PrivateRoute } from "./PrivateRoutes";
import EncryptFile from "./pages/EncryptFile";
import ForgotPsw from "./pages/ForgotPsw";
import fire from "./configs/firebase-configs";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const history = createBrowserHistory();
  const [inst, setInst] = useState(null);

  useEffect(() => {
    fire.analytics();
    history.listen((location, action) => {});
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
        <Route path="/PasswordReset" component={ForgotPsw} />
        <Redirect from="*" to="/" />
      </Switch>
    </div>
  );
}

export default App;
