import React from "react";
import { Box, Container, makeStyles } from "@material-ui/core";

// const useStyles = makeStyles((theme) => ({}));

const EgPageTitle = (props) => {
  const { title } = props;
  return (
    <Box>
      <Container>
        <h3>{title}</h3>
      </Container>
    </Box>
  );
};

export default EgPageTitle;
