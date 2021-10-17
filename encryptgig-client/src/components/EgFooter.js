import React from "react";
import CssBaseline from "@material-ui/core/CssBaseline";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import { withRouter } from "react-router-dom";
import { Box } from "@material-ui/core";

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {"Copyright © "}
      <Link color="inherit" href="https://encryptgig.com/">
        EncryptGig
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    minHeight: "70vh",
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: "auto",
    backgroundColor:
      theme.palette.type === "light"
        ? theme.palette.grey[200]
        : theme.palette.grey[800],
  },
  useful_links: {
    paddingLeft: "40%",
    ["@media (min-width:768px)"]: {
      // This is large screen
      paddingLeft: theme.spacing(30),
    },  
  },
  copyRight: {
    paddingLeft: "40%",
    paddingTop:theme.spacing(3),
    ["@media (min-width:768px)"]: {
      // This is large screen
      paddingTop:theme.spacing(0),
      paddingLeft: theme.spacing(80),
    }, 
  },
  listItem: {
    fontSize: 13,
    fontWight: 300,
    color: "#fff",
    position: "relative",
    paddingBottom: 4,
  },
  links: { textDecoration: "none" },
  list: { paddingBottom: 6, fontSize: 15, fontWight: 500 },
}));

const EgFooter = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <CssBaseline />
      <footer className={classes.footer}>
        <Box
          className={classes.useful_links}
          display="flex"
          flexDirection="column"
        >
          <Typography className={classes.list}>Useful Links</Typography>
          <Typography className={classes.listItem}>
            <a className={classes.links} href="https://encryptgig.com" target="_blank">
              Home
            </a>
          </Typography><Typography className={classes.listItem}>
            <a className={classes.links} href="/Contact" target="_blank">
              Contact Us
            </a>
          </Typography>
          <Typography className={classes.listItem}>
            <a
              className={classes.links}
              href="https://encryptgig.com/privacy-policy.html"
              target="_blank"
            >
              Privacy Policy
            </a>
          </Typography>
          <Typography className={classes.listItem}>
            <a
              className={classes.links}
              href="https://encryptgig.com/terms-conditions.html"
              target="_blank"
            >
              Terms & Conditions
            </a>
          </Typography>
        </Box>
        <Container className={classes.copyRight}>
          <Copyright />
        </Container>
      </footer>
    </div>
  );
};

export default withRouter(EgFooter);
