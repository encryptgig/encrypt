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
  drawerPadding: {
    paddingTop: theme.spacing(8),
    paddingLeft: theme.spacing(8),
    ["@media (min-width:768px)"]: {
      // This is large screen
      paddingLeft: 200,
    },
  },
}));

const UserGuide = (props) => {
  const globalClasses = globalStyles();
  const classes = useStyles();
  const { history } = props;

  return (
    <div className={classes.drawerPadding}>
      <object
        data="encryptgig_user_guide.pdf"
        type="application/pdf"
        style={{ width: "100%", height: "100vh" }}
      >
        <a href="encryptgig_user_guide.pdf">Cikck to Download User Guide</a>
      </object>
    </div>
  );
};

export default withRouter(UserGuide);
