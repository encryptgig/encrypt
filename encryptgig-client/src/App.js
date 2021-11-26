import React, { useState, useEffect } from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import EgDrawer from "./components/EgDrawer";
import Login from "./pages/Login";
import { userLogout } from "./Actions/userAction";
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
import EgSpinner from "./components/EgSpinner";
import AuditLogs from "./pages/AuditLogs";
import Dashboard from "./pages/Dashboard";
import { SecretRoute } from "./SecretRoutes";
import Pricing from "./pages/Pricing";
import { useDispatch } from "react-redux";
import Return from "./pages/Return";
import Checkout from "./pages/Checkout";
import EgFooter from "./components/EgFooter";
import UserGuide from "./pages/UserGuide";

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
  const dispatch = useDispatch();
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

    if (!WebAssembly.instantiateStreaming) {
      // polyfill
      WebAssembly.instantiateStreaming = async (resp, importObject) => {
        const source = await (await resp).arrayBuffer();
        return await WebAssembly.instantiate(source, importObject);
      };
    }
    WebAssembly.instantiateStreaming(fetch("main.wasm"), go.importObject).then(
      (result) => {
        go.run(result.instance);
        setInst(result.instance);
        checkForLogin(existingTokens);
      }
    );
  };

  const checkForLogin = async (existingTokens) => {
    if (existingTokens != null) {
      let payload = atob(existingTokens.split(".")[1]);

      if (JSON.parse(payload).exp < Date.now() / 1000) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("userName");
        localStorage.removeItem("photoUrl");
        dispatch(userLogout());
        return;
      }
      window.WASMGo.instantiateWithJWT(existingTokens);
    }
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
          <PrivateRoute exact path="/Checkout" component={Checkout} />
          <PrivateRoute exact path="/return" component={Return} />
          <PrivateRoute exact path="/Dashboard" component={Dashboard} />
          <Route exact path="/Pricing" component={Pricing} />
          <Route exact path="/UserGuide" component={UserGuide} />
          <Route exact path="/Contact" component={Contact} />
          {/* <Route path="/Login" component={Login} /> */}
          <Route path="/Register" component={Register} />
          <Route path="/PasswordReset" component={ForgotPsw} />
          <Redirect from="*" to="/EncryptFile" />
        </Switch>
        <EgFooter />
      </ThemeProvider>
    </div>
  );
}

export default App;
