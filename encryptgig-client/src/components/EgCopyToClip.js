import React from "react";
import { makeStyles } from "@material-ui/core";
import EgButton from "./EgButton";

const CopyToClip = (props) => {
  const { dataToCopy } = props;
  const handleCopyToClipboard = (e) => {
    navigator.clipboard.writeText(dataToCopy);
  };
  return (
    <div>
      <EgButton
        text="Copy To Clipboard"
        onClick={handleCopyToClipboard}
      ></EgButton>
    </div>
  );
};

export default CopyToClip;
