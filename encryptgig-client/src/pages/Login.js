import { makeStyles, Modal } from "@material-ui/core";
import React from "react";
import { withRouter } from "react-router-dom";
import { GoogleLogin } from "react-google-login";

const CLIENT_ID =
  "1069934900773-fn61ukfjudqa9medkn4sms9902ik9mtd.apps.googleusercontent.com";

const useStyles = makeStyles((theme) => ({
  paper: {
    position: "absolute",
    width: 400,
    backgroundColor: theme.palette.background.paper,
    border: "2px solid #000",
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));
function getModalStyle() {
  const top = 50;
  const left = 50;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const Login = (props) => {
  const classes = useStyles();
  const { history } = props;
  const [modalStyles] = React.useState(getModalStyle);
  const wasm = window.WASMGo;
  const login = (response) => {
    if (response.accessToken) {
      localStorage.setItem("accessToken", JSON.stringify(response.accessToken));
    }
    history.push("/");
    console.log(response.tokenId);
    wasm.instantiateWithJWT(response.tokenId);
    console.log(wasm.getState());
  };
  const handleLoginFailure = () => {
    alert("login failed");
  };
  const body = (
    <div style={modalStyles} className={classes.paper}>
      <h2 id="simple-modal-title">Login</h2>
      <GoogleLogin
        clientId={CLIENT_ID}
        buttonText="Login"
        onSuccess={login}
        onFailure={handleLoginFailure}
        cookiePolicy={"single_host_origin"}
        responseType="code,token"
      />
    </div>
  );

  return (
    <Modal
      open={true}
      onClose={() => {
        history.push("/Home");
        return false;
      }}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      {body}
    </Modal>
  );
};

export default withRouter(Login);
