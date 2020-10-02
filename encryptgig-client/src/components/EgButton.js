import React from "react";
import { Button, makeStyles, withStyles } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  padding1: {
    margin: theme.spacing(1),
  },
}));

const EgButton = (props) => {
  const classes = useStyles();
  const { text, onClick } = props;
  return (
    <Button
      variant="contained"
      component="label"
      color="primary"
      className={classes.padding1}
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export default withStyles(useStyles)(EgButton);
