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
import fire from "../configs/firebase-configs";
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

const ForgotPassword = (props) => {
  const classes = useStyles();
  const { history } = props;
  const [email, setEmail] = React.useState("");
  const [mailSent, setMailSent] = React.useState(false);
  const [errorText, setErrorText] = React.useState("");
  const resetPassword = () => {
    //e.preventDefaults();
    if (email.length === 0) {
      setErrorText("Email cannot be blank.");
      return;
    }
    fire
      .auth()
      .sendPasswordResetEmail(email)
      .then(function () {
        setMailSent(true);
        fire.analytics().logEvent("passwordReset_mail_sent");
      })
      .catch((err) => {
        alert("Error while sending email.");
        fire.analytics().logEvent("passwordReset_mail_failed", { error: err });
      });
  };

  return (
    <Container className={classes.Container} component="main" maxWidth="xs">
      <CssBaseline />
      <div className={classes.paper}>
        <Avatar className={classes.avatar}>{<LockOutlinedIcon />}</Avatar>
        <Typography component="h1" variant="h5">
          Reset Your Password
        </Typography>
        <br />
        <form className={classes.form} noValidate>
          {!mailSent ? (
            <Typography variant="body2">
              Enter your user account's verified email address and we will send
              you a password reset link.
            </Typography>
          ) : (
            <Typography variant="body2">
              Check your email for a link to reset your password. If it doesn’t
              appear within a few minutes, check your spam folder.
            </Typography>
          )}
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
            onChange={(e) => setEmail(e.target.value)}
            disabled={mailSent}
            error={errorText.length > 0}
            helperText={errorText}
          />
          {!mailSent ? (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={resetPassword}
            >
              Send Password Reset Email
            </Button>
          ) : (
            <Button
              fullWidth
              variant="contained"
              color="primary"
              className={classes.submit}
              onClick={() => {
                history.push("/Login");
              }}
            >
              Go To Login
            </Button>
          )}
        </form>
      </div>
    </Container>
  );
};

export default withRouter(ForgotPassword);
