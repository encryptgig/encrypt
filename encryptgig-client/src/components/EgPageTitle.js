import React from "react";
import { Box, Container, makeStyles } from "@material-ui/core";

// const useStyles = makeStyles((theme) => ({}));

const EgPageTitle = (props) => {
  const { title } = props;
  return (
    <Box>
      <h3>{title}</h3>
    </Box>
  );
};

export default EgPageTitle;
