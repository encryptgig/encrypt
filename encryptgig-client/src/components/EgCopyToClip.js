import React from "react";
import { makeStyles, Snackbar } from "@material-ui/core";
import EgButton from "./EgButton";
import MuiAlert from "@material-ui/lab/Alert";

const CopyToClip = (props) => {
  const { dataToCopy } = props;
  const [open, setOpen] = React.useState(false);
  const handleCopyToClipboard = (e) => {
    navigator.clipboard.writeText(dataToCopy);
    setOpen(true);
  };
  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
  };
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  return (
    <div>
      <EgButton
        text="Copy To Clipboard"
        onClick={handleCopyToClipboard}
        icon="copy"
      ></EgButton>
      <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success">
          Data Copied to clipboard !
        </Alert>
      </Snackbar>
    </div>
  );
};

export default CopyToClip;
