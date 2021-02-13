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
import { Contactless } from "@material-ui/icons";
import Contact from "./pages/Contact";
import {
  MuiThemeProvider,
  ThemeProvider,
  createMuiTheme,
} from "@material-ui/core/styles";
import blue from "@material-ui/core/colors/blue";
import EgSpinner from "./components/EgSpinner";
import AuditLogs from "./pages/AuditLogs";
import Dashboard from "./pages/Dashboard";
import { SecretRoute } from "./SecretRoutes";
import Pricing from "./pages/Pricing";

//Added a new font Family
const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#64b5f6",
    },
  },
  typography: {
    fontSize: 13,
    fontFamily: ["Roboto", "sans-sarif"].join(","),
  },
});

function App() {
  const existingTokens = localStorage.getItem("accessToken");
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
        if (existingTokens != null) {
          window.WASMGo.instantiateWithJWT(existingTokens);
        }
      }
    );
  };

  return (
    <div>
      <ThemeProvider theme={theme}>
        <EgHeader />
        <EgDrawer />
        <EgSpinner />
        <Login />
        <Switch>
          <SecretRoute exact path="/EncryptData" component={EncryptData} />
          <SecretRoute exact path="/EncryptFile" component={EncryptFile} />
          <SecretRoute exact path="/EncryptExcel" component={EncryptExcel} />
          <SecretRoute exact path="/EncryptMedia" component={EncryptMedia} />
          <PrivateRoute exact path="/AuditLogs" component={AuditLogs} />
          <PrivateRoute exact path="/Dashboard" component={Dashboard} />
          <Route exact path="/Pricing" component={Pricing} />
          <Route exact path="/Contact" component={Contact} />
          {/* <Route path="/Login" component={Login} /> */}
          <Route path="/Register" component={Register} />
          <Route path="/PasswordReset" component={ForgotPsw} />
          <Redirect from="*" to="/EncryptFile" />
        </Switch>
      </ThemeProvider>
    </div>
  );
}

export default App;
