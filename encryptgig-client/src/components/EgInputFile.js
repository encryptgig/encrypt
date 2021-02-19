import React, { useMemo } from "react";
import { Box, Typography } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import ArchiveIcon from "@material-ui/icons/Archive";
import { uploadFiles } from "../Actions/fileActions";
import Dropzone, { useDropzone } from "react-dropzone";

// const useStyles = makeStyles((theme) => ({}));
const baseStyle = {
  flex: 1,
  display: "flex",
  width: "98%",
  flexDirection: "column",
  alignItems: "center",
  padding: "20px",
  borderBottom: "1px solid rgba(0, 0, 0, 0.42) ",
  backgroundColor: "rgba(0, 0, 0, 0.09)",
  color: "#bdbdbd",
  outline: "none",
  transition: "border .24s ease-in-out",
};

const activeStyle = {
  borderColor: "#2196f3",
};

const acceptStyle = {
  borderColor: "#00e676",
};

const rejectStyle = {
  borderColor: "#ff1744",
};

const EgInputFile = (props) => {
  const uploadedFile = useSelector((state) => state);
  const dispatch = useDispatch();
  const { maxAllowedCount } = props;

  const renderText = (e) => {
    if (uploadedFile.files?.file == null) {
      return <div>No file chosen</div>;
    } else {
      return (
        <ul>
          {uploadedFile.files.file.map((fileEntry) => (
            <li>{fileEntry.name}</li>
          ))}
        </ul>
      );
    }
  };
  const {
    getRootProps,
    getInputProps,
    isDragActive,
    isDragAccept,
    isDragReject,
  } = useDropzone({ maxFiles: 2 });

  const style = useMemo(
    () => ({
      ...baseStyle,
      ...(isDragActive ? activeStyle : {}),
      ...(isDragAccept ? acceptStyle : {}),
      ...(isDragReject ? rejectStyle : {}),
    }),
    [isDragActive, isDragReject, isDragAccept]
  );
  return (
    <div>
      <Dropzone
        onDrop={(acceptedFiles) => {
          if (acceptedFiles.length > maxAllowedCount) {
            alert("You can select maximum of " + maxAllowedCount + " files.");
            return;
          }
          dispatch(uploadFiles(acceptedFiles));
        }}
      >
        {({ getRootProps, getInputProps }) => (
          <section>
            <div {...getRootProps({ style })}>
              <input {...getInputProps()} />
              <Box display="flex" flexDirection="row">
                <Typography color="textSecondary">
                  <ArchiveIcon style={{ marginRight: 5 }} />
                </Typography>
                <Typography color="textSecondary">
                  <b>Drag 'n' drop some files here, or click to select files</b>
                </Typography>
              </Box>
            </div>
          </section>
        )}
      </Dropzone>
      <Typography>Selected Files:</Typography>
      {renderText()}
    </div>
  );
};

export default EgInputFile;
