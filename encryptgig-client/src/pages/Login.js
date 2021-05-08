import {
  Avatar,
  Box,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  Dialog,
  Divider,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import SvgIcon from "@material-ui/core/SvgIcon";
import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import fire from "./../configs/firebase-configs";
import firebase from "firebase";
import { useDispatch, useSelector } from "react-redux";
import { userLogin, userLogout } from "../Actions/userAction";
import { showSpinner } from "../Actions/spinnerAction";
import { showLogin } from "../Actions/showLoginAction";

//TODO: Bug - after refresh user should remain logged-in
const useStyles = makeStyles((theme) => ({
  Container: {
    paddingTop: theme.spacing(1),
    paddingBottom: theme.spacing(1),
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.primary.main,
  },
  form: {
    width: "80%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
    color: "white",
  },
  googleSubmit: {
    margin: theme.spacing(3, 0, 2),
    color: "#FFFFFF",
    backgroundColor: "#DB4437",
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { history } = props;
  const handleClose = () => {
    dispatch(showLogin(false));
  };
  const [loginState, setLoginState] = useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = useState(false);
  const [emailText, setEmailText] = useState("");
  const [passwordText, setPasswordText] = useState("");
  const shouldShowLogin = useSelector((state) => state.showLogin.showLogin);
  const updateLoginState = (event) => {
    setLoginState({
      ...loginState,
      [event.target.name]: event.target.value,
    });
  };
  const wasm = window.WASMGo;
  const login = () => {
    //e.preventDefaults();

    if (loginState.email.length === 0) {
      setEmailText("Email cannot be blank.");
    }

    if (loginState.password.length === 0) {
      setPasswordText("Password cannot be blank.");
    }
    if (loginState.email.length === 0 || loginState.password.length === 0) {
      return;
    }
    const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!re.test(loginState.email)) {
      setEmailText("Email not valid.");
      return;
    }

    fire
      .auth()
      .signInWithEmailAndPassword(loginState.email, loginState.password)
      .then((u) => {
        console.log(u);
        if (u.user.emailVerified) {
          dispatch(showLogin(false));
          dispatch(showSpinner(true));
          handleLoginSuccess(u, loginState.email, u.user.ya);
          dispatch(userLogin(loginState.email, null, null));
          localStorage.setItem("accessToken", u.user.ya);
          fire.analytics().logEvent("psw_login_success");
          history.push("/EncryptFile");
        } else {
          fire.analytics().logEvent("unverified_login_attempt");
          alert("Please verify your email first");
        }
      })
      .catch((err) => {
        setLoginError(true);
        fire.analytics().logEvent("login_failed", { error: err });
      });
  };
  const loginGoogle = async () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    fire
      .auth()
      .signInWithPopup(provider)
      .then((u) => {
        console.log(u);
        dispatch(showLogin(false));
        dispatch(showSpinner(true));
        handleLoginSuccess(u, u.user.email, u.credential.idToken);

        localStorage.setItem("accessToken", u.credential.idToken);
        localStorage.setItem("userName", u.user.displayName);
        localStorage.setItem("photoUrl", u.user.photoURL);
        localStorage.setItem("userEmail", u.user.email);
        dispatch(userLogin(u.user.email, u.user.displayName, u.user.photoURL));
        fire.analytics().logEvent("google_login_success");
      })
      .catch((err) => {
        setLoginError(true);
        fire.analytics().logEvent("google_login_failed", { error: err });
      });
  };
  const loginGithub = () => {
    let provider = new firebase.auth.GithubAuthProvider();
    fire
      .auth()
      .signInWithPopup(provider)
      .then((u) => {
        handleLoginSuccess(u, "");
        fire.analytics().logEvent("github_login_success");
      })
      .catch((err) => {
        setLoginError(true);
        fire.analytics().logEvent("github_login_failed", { error: err });
      });
  };
  const handleLoginSuccess = async (u, email, jwt) => {
    try {
      await wasm.instantiateWithJWT(jwt);

      dispatch(showSpinner(false));
    } catch (err) {
      fire.analytics().logEvent("wasm_instantiation_failed.", err);
      dispatch(showSpinner(false));
      alert(err);
    }
    fire.analytics().setUserId(u.user.uid);
  };
  console.log(shouldShowLogin);
  return (
    <Dialog
      aria-labelledby="Login"
      open={shouldShowLogin}
      onClose={handleClose}
    >
      <Container className={classes.Container} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Alert severity="info">
            Sign in to perform all secure operations
          </Alert>
          <Avatar className={classes.avatar}>{<LockOutlinedIcon />}</Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {loginError ? (
            <Alert severity="error">Incorrect email address or password.</Alert>
          ) : (
            ""
          )}
          <form className={classes.form}>
            <Button
              fullWidth
              variant="contained"
              className={classes.googleSubmit}
              startIcon={
                <SvgIcon>
                  <svg
                    aria-hidden="true"
                    data-prefix="fab"
                    data-icon="google-login"
                    role="img"
                    viewBox="0 0 480 512"
                  >
                    <path
                      fill="#FFFFFF"
                      d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
                    />
                  </svg>
                </SvgIcon>
              }
              onClick={loginGoogle}
            >
              Sign In with Google
            </Button>
            <Box display="flex" flexDirection="row">
              <Divider
                style={{ marginTop: "10px", marginRight: "10px", width: "43%" }}
              />
              <Typography>OR</Typography>
              <Divider
                style={{ marginTop: "10px", marginLeft: "10px", width: "43%" }}
              />
            </Box>
            <TextField
              error={emailText.length > 0}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              helperText={emailText}
              onChange={updateLoginState}
            />
            <TextField
              error={passwordText.length > 0}
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type="password"
              id="password"
              autoComplete="current-password"
              helperText={passwordText}
              onChange={updateLoginState}
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Remember me"
            />
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={login}
            >
              Sign In
            </Button>
            {/* <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={loginGithub}
          >
            Sign In with Microsoft
          </Button> */}
            <Grid container>
              <Grid item xs>
                <Link to="/PasswordReset" variant="body2">
                  Forgot password?
                </Link>
              </Grid>
              <Grid item>
                <Link variant="body2" to="/Register">
                  {"Don't have an account? Sign Up"}
                </Link>
              </Grid>
            </Grid>
          </form>
        </div>
      </Container>
    </Dialog>
  );
};

export default withRouter(Login);
