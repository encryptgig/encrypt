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
import ShoppingCartIcon from "@material-ui/icons/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { showLogin } from "../Actions/showLoginAction";

//TODO: Bug - after refresh user should remain logged-in
const useStyles = makeStyles((theme) => ({
  Container: {
    padding: theme.spacing(5),
    height: "70%",
  },
  paper: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    backgroundColor: theme.palette.background.paper,
    borderRadius: 10,
  },
  avatar: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(3),
    marginRight: theme.spacing(3),
    backgroundColor: theme.palette.primary.main,
  },
  subscription: {
    paddingRight: theme.spacing(10),
  },
  content: {
    marginTop: theme.spacing(4),
    paddingTop: theme.spacing(2),
    borderTop: "1px solid lightgrey",
    width: "100%",
  },
  content1: {
    marginTop: theme.spacing(5),
    width: "100%",
  },
  li: {
    marginLeft: theme.spacing(2),
    marginTop: theme.spacing(2),
  },
  submit: {
    marginTop: theme.spacing(3),
  },
}));

const Checkout = (props) => {
  const classes = useStyles();

  const handleClose = () => {};

  const NavigateToRegister = () => {
    if (
      localStorage.getItem("accessToken") !== null &&
      localStorage.getItem("accessToken").length !== 0
    ) {
      let token = localStorage.getItem("accessToken");
      var href =
        "https://encryptgig-3nere6jg5a-uc.a.run.app/buy?planid=plan3000&jwt=" +
        token;
      window.location.replace(href);
    } else {
      alert("Token is null please login");
    }
  };

  return (
    <Dialog aria-labelledby="Login" open={true} onClose={handleClose}>
      <Container className={classes.Container} component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <Avatar className={classes.avatar}>{<ShoppingCartIcon />}</Avatar>
          <Typography component="h1" variant="h5">
            Summary
          </Typography>
          <Divider />
          <Box display="flex" flexDirection="row" className={classes.content1}>
            <Box className={classes.subscription}>
              <Typography>EncryptGig Pro Subscription</Typography>
              <li className={classes.li}>3000 Requests</li>
              <li className={classes.li}> 100 GB Data</li>
            </Box>
            <Box>
              <Typography>Rs. 499</Typography>
            </Box>
          </Box>
          <Divider style={{ margin: "10px" }} variant="middle" />
          <Box display="flex" flexDirection="row" className={classes.content}>
            <Box flex={1} className={classes.subscription}>
              <Typography>Total</Typography>
            </Box>
            <Box>
              <Typography style={{ paddingRight: "0px" }}>Rs. 499</Typography>
            </Box>
          </Box>
          <Button
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
            onClick={NavigateToRegister}
          >
            Buy
          </Button>
        </div>
      </Container>
    </Dialog>
  );
};

export default withRouter(Checkout);
