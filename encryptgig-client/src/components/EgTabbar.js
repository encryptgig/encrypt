import React from "react";
import { AppBar, Box, makeStyles, Tabs, Typography } from "@material-ui/core";
import PropTypes from "prop-types";

const useStyles = makeStyles((theme) => ({
  appbar: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
}));

export const EgTabbar = (props) => {
  const [tabValue, setTabValue] = React.useState(0);
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  const hadleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  return (
    <AppBar
      position="static"
      style={{ width: "98%" }}
      color="default"
      className={classes.appbar}
    >
      <Tabs
        value={tabValue}
        onChange={hadleTabChange}
        indicatorColor="primary"
        textColor="primary"
        variant="fullWidth"
        aria-label="full width tabs example"
      >
        {children}
      </Tabs>
    </AppBar>
  );
};
