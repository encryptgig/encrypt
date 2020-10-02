import React from "react";
import { Box, Button, makeStyles, Typography } from "@material-ui/core";

const useStyles = makeStyles((theme) => ({}));

const EgInputFile = (props) => {
  const [file, setFile] = React.useState(null);
  const handleChange = (e) => {
    setFile(e.target.files[0]);
  };
  const renderText = (e) => {
    if (file == null) {
      return <div>No file chosen</div>;
    } else {
      return <div>{file.name}</div>;
    }
  };
  return (
    <div>
      <Button variant="contained" component="label" color="primary">
        Upload File
        <input
          type="file"
          style={{ display: "none" }}
          onChange={handleChange}
        />
      </Button>
      {renderText()}
      <Box
        display="flex"
        flexDirection="row"
        p={1}
        m={1}
        bgcolor="background.paper"
      ></Box>
    </div>
  );
};

export default EgInputFile;
