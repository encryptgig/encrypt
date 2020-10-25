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
import Alert from "@material-ui/lab/Alert";

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));

const Register = (props) => {
  const classes = useStyles();
  const { history } = props;
  const [signupError, setSignupError] = React.useState(false);
  const [loginState, setLoginState] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const updateLoginState = (event) => {
    setLoginState({
      ...loginState,
      [event.target.name]: event.target.value,
    });
  };
  const [loginValidationState, setLoginValidationState] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
  });
  const [mailSent, setMailSent] = React.useState(false);
  const handleSignup = () => {
    if (loginState.email.length == 0) {
      setLoginValidationState({
        ...loginValidationState,
        email: "Email cannot be blank.",
      });
    }
    if (loginState.password.length == 0) {
      setLoginValidationState((prevState) => {
        return {
          ...prevState,
          password: "password cannot be blank.",
        };
      });
    }
    if (loginState.firstName.length == 0) {
      setLoginValidationState((prevState) => {
        return {
          ...prevState,
          firstName: "First name cannot be blank.",
        };
      });
    }
    if (loginState.lastName.length == 0) {
      setLoginValidationState((prevState) => {
        return {
          ...prevState,
          lastName: "Last name cannot be blank.",
        };
      });
    }
    if (
      loginState.lastName.length == 0 ||
      loginState.firstName.length == 0 ||
      loginState.email.length == 0 ||
      loginState.password.length == 0
    ) {
      return;
    }
    fire
      .auth()
      .createUserWithEmailAndPassword(loginState.email, loginState.password)
      .then((u) => {
        var user = fire.auth().currentUser;
        user
          .sendEmailVerification()
          .then(function () {
            setMailSent(true);
            fire.analytics().logEvent("signup_mail_sent");
          })
          .catch(function (error) {
            setSignupError(true);
            fire.analytics().logEvent("signup_mail_failed", { error: error });
          });
      })
      .catch((error) => {
        setSignupError(true);
        fire.analytics().logEvent("signup_failed", { error: error });
      });
  };

  return (
    <Container component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        {signupError ? (
          <Alert severity="error">Error while sign up.</Alert>
        ) : (
          ""
        )}
        {mailSent ? (
          <Alert severity="Success">
            We have sent verification mail. Please verify and login.
          </Alert>
        ) : (
          ""
        )}
        <form className={classes.form} noValidate>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                error={loginValidationState.firstName.length > 0}
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                onChange={updateLoginState}
                autoFocus
                helperText={loginValidationState.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                error={loginValidationState.lastName.length > 0}
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                onChange={updateLoginState}
                helperText={loginValidationState.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={loginValidationState.email.length > 0}
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                onChange={updateLoginState}
                helperText={loginValidationState.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                error={loginValidationState.password.length > 0}
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                onChange={updateLoginState}
                autoComplete="current-password"
                helperText={loginValidationState.password}
              />
            </Grid>
            {/* <Grid item xs={12}>
              <FormControlLabel
                control={<Checkbox value="allowExtraEmails" color="primary" />}
                label="I want to receive inspiration, marketing promotions and updates via email."
              />
            </Grid> */}
          </Grid>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={handleSignup}
          >
            Sign Up
          </Button>
          <Grid container justify="flex-end">
            <Grid item>
              <Link variant="body2" to="/Login">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
    </Container>
  );
};

export default withRouter(Register);
