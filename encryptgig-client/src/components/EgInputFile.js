import React from "react";
import { Box, Button, makeStyles } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { uploadFile } from "../Actions/fileActions";

// const useStyles = makeStyles((theme) => ({}));

const EgInputFile = (props) => {
  const uploadedFile = useSelector((state) => state);
  const dispatch = useDispatch();
  const handleChange = (e) => {
    e.preventDefault();
    dispatch(uploadFile(e.target.files[0]));
  };
  const renderText = (e) => {
    if (uploadedFile.files?.file == null) {
      return <div>No file chosen</div>;
    } else {
      return <div>{uploadedFile.files.file.name}</div>;
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
