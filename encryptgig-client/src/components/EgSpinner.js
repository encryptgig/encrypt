import React, { useState } from "react";

import { css } from "@emotion/core";
import { Backdrop, Button, makeStyles, withStyles } from "@material-ui/core";
import { DotLoader, PacmanLoader, PropagateLoader} from "react-spinners";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({
    backdrop: {
        zIndex: theme.zIndex.drawer + 1,
        color: '#fff',
      },
}));
const override = css`
  display: block;
  margin: 0 auto;
  border-color: red;
`;

const EgSpinner = (props) => {
  const classes = useStyles();
  const spinnerState = useSelector((state) => state.spinner);

 console.log(spinnerState);

  return (
    <Backdrop className={classes.backdrop} open={spinnerState.show}>
          <PropagateLoader

    css={override}
    size={20}
    color={"#1D7CE8"}
    loading={spinnerState.show}
  />
      </Backdrop>
  
  );
};

export default EgSpinner;
