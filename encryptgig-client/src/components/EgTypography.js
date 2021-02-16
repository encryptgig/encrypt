import React from "react";
import { makeStyles, Typography } from "@material-ui/core";
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import { FormatAlignJustify } from "@material-ui/icons";

const useStyles = makeStyles((theme) => ({
  padding1: {
    margin: theme.spacing(2),
  },
}));

const EgTypography = (props) => {
  const { text } = props;
  const classes = useStyles();
  return (
    

    <Typography
      className={classes.padding1}
      color="textSecondary"
      variant="body2"
      gutterBottom
     
      
    >
      {props.children}
    </Typography>
   
  );
};




export default EgTypography;
