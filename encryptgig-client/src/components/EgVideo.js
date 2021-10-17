import { Divider } from "@material-ui/core";
import React from "react";
import EgPageTitle from "./EgPageTitle";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles((theme) => ({
  iframe: {
    width: "95%",
    height: 180,
    ["@media (min-width:768px)"]: {
      // This is large screen
      width: 600,
      height: 400,
    },
  },
}));

const EgVideo = () => {
  const classes = useStyles();
  return (
    <div>
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="Video Tutorial - How To Secure Your Data With EncryptGig."></EgPageTitle>
      <div
        style={{
          overflow: "hidden",
          paddingBottom: "2%",
          position: "relative",
        }}
      >
        <iframe
          className={classes.iframe}
          src={`https://www.youtube.com/embed/BkaK7JlkkbI`}
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title="EncryptGig Video Tutorial"
        />
      </div>
    </div>
  );
};

export default EgVideo;
