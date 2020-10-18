import {
  Avatar,
  Button,
  Checkbox,
  Container,
  CssBaseline,
  FormControlLabel,
  Grid,
  makeStyles,
  Modal,
  TextField,
  Typography,
} from "@material-ui/core";
import React from "react";
import { Link, withRouter } from "react-router-dom";
import LockOutlinedIcon from "@material-ui/icons/LockOutlined";
import fire from "./../configs/firebase-configs";
import firebase from "firebase";

const CLIENT_ID =
  "1069934900773-fn61ukfjudqa9medkn4sms9902ik9mtd.apps.googleusercontent.com";

const useStyles = makeStyles((theme) => ({
  Container: {},
  paper: {
    marginTop: theme.spacing(8),
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
    marginBottom: theme.spacing(2),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Login = (props) => {
  const classes = useStyles();
  const { history } = props;
  const [loginState, setLoginState] = React.useState({
    email: "",
    password: "",
  });
  const updateLoginState = (event) => {
    setLoginState({
      ...loginState,
      [event.target.name]: event.target.value,
    });
  };
  const wasm = window.WASMGo;
  const login = () => {
    //e.preventDefaults();
    fire
      .auth()
      .signInWithEmailAndPassword(loginState.email, loginState.password)
      .then((u) => {
        handleLoginSuccess(u);
      })
      .catch((err) => {
        alert("login failed:" + err);
      });
  };
  const loginGoogle = () => {
    let provider = new firebase.auth.GoogleAuthProvider();
    fire
      .auth()
      .signInWithPopup(provider)
      .then((u) => {
        handleLoginSuccess(u);
      })
      .catch((err) => {
        alert("login failed" + err);
      });
  };
  const loginGithub = () => {
    let provider = new firebase.auth.GithubAuthProvider();
    fire
      .auth()
      .signInWithPopup(provider)
      .then((u) => {
        handleLoginSuccess(u);
      })
      .catch((err) => {
        alert("login failed" + err);
      });
  };
  const handleLoginSuccess = (u) => {
    console.log(u);
    alert("login successful");
    history.push("/");
    wasm.instantiateWithJWT(u.tokenId);
  };

  return (
    <Container className={classes.Container} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>{<LockOutlinedIcon />}</Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <form className={classes.form} noValidate>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
            onChange={updateLoginState}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
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
            Sign In with Github
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Forgot password?
              </Link>
            </Grid>
            <Grid item>
              <Link href="#" variant="body2">
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
