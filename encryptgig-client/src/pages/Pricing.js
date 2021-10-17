import React from "react";
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
      "1000 encrypt/decrypt requests",
      "5 GB data limit",
      "Email support",
    ],
    buttonText: "Sign up for free",
    buttonVariant: "outlined",
  },
  {
    title: "Pro",
    subheader: "Most popular",
    price: "499",
    description: [
      "3000 encrypt/decrypt requests",
      "100 GB data limit",
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

const Pricing = (props) => {
  const globalClasses = globalStyles();
  const classes = useStyles();
  const { history } = props;
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
      history.push("/Checkout");
    } else {
      alert("Please login to continue");
    }
  };

  const getToken = () => {
    return localStorage.getItem("accessToken");
  };
  return (
    <div className={globalClasses.drawerPadding}>
      <CssBaseline />

      <Container maxWidth="sm" component="main" className={classes.heroContent}>
        <Typography
          component="h1"
          variant="h2"
          align="center"
          color="textPrimary"
          gutterBottom
        >
          ₹Pricing
        </Typography>
        <Typography
          variant="h5"
          align="center"
          color="textSecondary"
          component="p"
        >
          EncryptGig purchase options
        </Typography>
      </Container>
      {/* End hero unit */}
      <Container maxWidth="md" component="main">
        <Grid container spacing={5} alignItems="flex-end">
          {tiers.map((tier) => (
            // Enterprise card is full width at sm breakpoint
            <Grid
              item
              key={tier.title}
              xs={12}
              sm={tier.title === "Enterprise" ? 12 : 6}
              md={4}
            >
              <Card>
                <CardHeader
                  title={tier.title}
                  subheader={tier.subheader}
                  titleTypographyProps={{ align: "center" }}
                  subheaderTypographyProps={{ align: "center" }}
                  action={tier.title === "Pro" ? <StarIcon /> : null}
                  className={classes.cardHeader}
                />
                <CardContent className={classes.cardContent}>
                  <div className={classes.cardPricing}>
                    <Typography component="h4" variant="h4" color="textPrimary">
                      {tier.title !== "Enterprise" ? "₹" : ""} {tier.price}
                    </Typography>
                  </div>
                  <ul>
                    {tier.description.map((line) => (
                      <Typography
                        component="li"
                        variant="subtitle1"
                        align="center"
                        key={line}
                      >
                        {line}
                      </Typography>
                    ))}
                  </ul>
                </CardContent>
                <CardActions>
                  <Button
                    fullWidth
                    variant={tier.buttonVariant}
                    color="primary"
                    onClick={
                      tier.title === "Free"
                        ? NavigateToRegister
                        : NavigateToRegister
                    }
                  >
                    {tier.buttonText}
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </div>
  );
};

export default withRouter(Pricing);
