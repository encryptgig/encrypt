import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import EgDrawer from "./components/EgDrawer";
import Login from "./pages/Login";
import Register from "./pages/Register";
import EncryptData from "./pages/EncryptData";
import { createBrowserHistory } from "history";
import { PrivateRoute } from "./PrivateRoutes";
import EncryptFile from "./pages/EncryptFile";
import ForgotPsw from "./pages/ForgotPsw";
import fire from "./configs/firebase-configs";
import EncryptExcel from "./pages/EncryptExcel";
import EncryptMedia from "./pages/EncryptMedia";
import EgHeader from "./components/EgHeader";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";

function App() {
  const existingTokens = JSON.parse(localStorage.getItem("tokens"));
  const history = createBrowserHistory();
  const [inst, setInst] = useState(null);

  useEffect(() => {
    fire.analytics();
    history.listen((location, action) => {});
    loadWasm();
  }, []);

  // TODO: signature matching for web assembly
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
  // Or Create your Own theme:
  const theme = createMuiTheme({
    // palette: {
    //   primary: {
    //     main: "#FF0000",
    //   },
    // },
  });

  return (
    <div>
      <MuiThemeProvider theme={theme}>
        <EgHeader />
        <EgDrawer />
        <Switch>
          <PrivateRoute exact path="/EncryptData" component={EncryptData} />
          <PrivateRoute exact path="/EncryptFile" component={EncryptFile} />
          <PrivateRoute exact path="/EncryptExcel" component={EncryptExcel} />
          <PrivateRoute exact path="/EncryptMedia" component={EncryptMedia} />
          <Route path="/Login" component={Login} />
          <Route path="/Register" component={Register} />
          <Route path="/PasswordReset" component={ForgotPsw} />
          <Redirect from="*" to="/" />
        </Switch>
      </MuiThemeProvider>
    </div>
  );
}

export default App;
