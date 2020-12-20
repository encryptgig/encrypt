import {
  Avatar,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  makeStyles,
  TextField,
  Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import fire from "./../configs/firebase-configs";
import firebase from "firebase";
import { useDispatch } from "react-redux";
import { userLogin, userLogout } from "../Actions/userAction";
import { showSpinner } from "../Actions/spinnerAction";

//TODO: Bug - after refresh user should remain logged-in
const useStyles = makeStyles((theme) => ({
  Container: {},
  paper: {
    marginTop: theme.spacing(4),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "80%", // Fix IE 11 issue.
    marginTop: theme.spacing(1),
    marginBottom: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
    color: "white",
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const { history } = props;
  const [loginState, setLoginState] = React.useState({
    email: "",
    password: "",
  });
  const [loginError, setLoginError] = React.useState(false);
  const [emailText, setEmailText] = React.useState("");
  const [passwordText, setPasswordText] = React.useState("");
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
        dispatch(showSpinner(true));
        handleLoginSuccess(u, u.user.email, u.credential.idToken);

        localStorage.setItem("accessToken", u.credential.idToken);
        localStorage.setItem("userName", u.user.displayName);
        localStorage.setItem("photoUrl", u.user.photoURL);
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
      history.push("/EncryptFile");
    } catch (err) {
      fire.analytics().logEvent("wasm_instantiation_failed.", err);
      dispatch(showSpinner(false));
      alert(err);
    }
    fire.analytics().setUserId(u.user.uid);
  };

  return (
    <Container className={classes.Container} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
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
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={loginGoogle}
          >
            Sign In with Google
          </Button>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={loginGithub}
          >
            Sign In with Microsoft
          </Button>
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
  );
};

export default withRouter(Login);
