import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import CssBaseline from "@material-ui/core/CssBaseline";
import Grid from "@material-ui/core/Grid";
import StarIcon from "@material-ui/icons/StarBorder";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Box from "@material-ui/core/Box";
import { globalStyles } from "../styles/global.styles";

const useStyles = makeStyles((theme) => ({
  "@global": {
    ul: {
      margin: 0,
      padding: 0,
      listStyle: "none",
    },
  },

  link: {
    margin: theme.spacing(1, 1.5),
  },
  heroContent: {
    padding: theme.spacing(8, 0, 6),
  },
  cardHeader: {
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[700],
  },
  cardPricing: {
    display: "flex",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: theme.spacing(2),
  },
  cardContent: {
    height: "230px",
  },
}));

const tiers = [
  {
    title: "Free",
    price: "0",
    description: [
      "100 encrypt/decrypt requests",
      "1 GB data limit",
      "Email support",
    ],
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
  },
  {
    title: "Pro",
    subheader: "Most popular",
    price: "3000",
    description: [
      "3000 encrypt/decrypt requests",
      "5 GB data limit",
      "Help center access",
      "Priority email support",
    ],
    buttonText: "Get started",
    buttonVariant: "contained",
  },
  {
    title: "Enterprise",
    price: "As Per Usage",
    description: [
      "Unlimited data and requests",
      "Flexible pricing options",
      "Customized deployment on-premise/cloud",
      "Dedicated help center access",
      "Phone & email support",
    ],
    buttonText: "Contact us",
    buttonVariant: "outlined",
  },
];

const Return = (props) => {
  const globalClasses = globalStyles();
  const classes = useStyles();
  const { all } = props;
  const NavigateToRegister = () => {
    console.log(all);
    if (
      localStorage.getItem("accessToken") !== null &&
      localStorage.getItem("accessToken").length !== 0
    ) {
      let token = localStorage.getItem("accessToken");
      var href =
        "https://encryptgig-3nere6jg5a-uc.a.run.app/buy?planid=plan_test&jwt=" +
        token;
      window.location.replace(href);
    } else {
      alert("Token is null please login");
    }
  };

  const getToken = () => {
    return localStorage.getItem("accessToken");
  };
  return (
    <div className={globalClasses.drawerPadding}>
      Hello, welcome to encryptgig.
    </div>
  );
};

export default withRouter(Return);
