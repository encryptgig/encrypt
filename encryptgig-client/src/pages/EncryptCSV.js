import {
  Box,
  Checkbox,
  Container,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
} from "@material-ui/core";
import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";

const EncryptCSV = (props) => {
  const uploadedFile = useSelector((state) => state);
  const [columns, setColumns] = useState([]);
  const renderText = () => {
    let index = 1;
    if (uploadedFile.files?.file == null) {
      return;
    } else {
      if (columns.length == 0) {
        var reader = new FileReader();
        reader.readAsText(uploadedFile.files.file);
        reader.onload = function (evt) {
          let str = evt.target.result.split(/\r?\n/)[0];
          setColumns(str.split(","));
        };
      } else {
        return (
          <FormControl component="fieldset">
            <FormLabel component="legend">Select Columns to encrypt</FormLabel>
            <FormGroup aria-label="position" row>
              {columns.map((column) => {
                let name = "column ";
                return (
                  <FormControlLabel
                    value={index}
                    control={<Checkbox color="primary" />}
                    label={name + index++}
                    labelPlacement="start"
                  />
                );
              })}
            </FormGroup>
          </FormControl>
        );
      }
    }
  };
  const handleDecrypt = () => {
    var file = uploadedFile.files.file;
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.readAsText(file);
  };
  const handleEncrypt = () => {
    var file = uploadedFile.files.file;
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
    }
  };

  return (
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="Data Encryption"></EgPageTitle>
      <EgInputFile />
      {renderText()}

      <Box display="flex" flexDirection="row">
        <EgButton text="Encrypt" onClick={handleEncrypt} />
        <EgButton text="decrypt" onClick={handleDecrypt} />
      </Box>
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About CSV Encryption"></EgPageTitle>
      <EgTypography>
        <b>We can encrypt any column or row in your csv.</b>
        We tokenize the data you give us in CSV file. Trust us we don't change
        the size of data while we tokenize it. The resultant fil is CSV, that
        contains your tokenized CSV data.
      </EgTypography>
    </div>
  );
};

export default withRouter(EncryptCSV);
