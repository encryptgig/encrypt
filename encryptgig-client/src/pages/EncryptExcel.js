import {
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Radio,
  RadioGroup,
  TextField,
  Tooltip,
  Typography,
} from "@material-ui/core";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { Autocomplete } from "@material-ui/lab";
import React, { useState } from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";

const EncryptCSV = (props) => {
  const uploadedFile = useSelector((state) => state);
  const [columns, setColumns] = useState([]);
  const [encryptType, setEncryptType] = useState("fullEncrypt");
  const [encrSheetCount, setEncrSheetCount] = useState(0);
  const [openTooltip, setOpenTooltip] = React.useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };
  const sheetNames = [
    "sales - monthly",
    "sales - quaterly",
    "sales - yearly",
    "expense - monthly",
    "expense - quaterly",
    "expense - yearly",
    "sales - monthly1",
    "sales - quaterly1",
    "sales - yearly1",
    "expense - monthly11",
    "expense - quaterly1",
    "expense - yearly1",
  ];
  const renderText = () => {
    let index = 1;
    if (uploadedFile.files?.file == null) {
      return;
    } else {
      if (columns.length === 0) {
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
    setEncrSheetCount(encrSheetCount + 1);
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
    }
  };
  const handleEncryptTypeChange = (event) => {
    setEncryptType(event.target.value);
  };
  const RenderSheetDetailcomp = () => {
    if (encryptType === "fullEncrypt") {
      return;
    }
    let p = (
      <Box display="flex" flexDirection="row">
        <Autocomplete
          options={sheetNames}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          renderInput={(params) => (
            <TextField {...params} label="Sheet Name" variant="outlined" />
          )}
        />
        <Autocomplete
          options={["rows", "columns"]}
          value="columns"
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          renderInput={(params) => <TextField {...params} variant="outlined" />}
        />
        <TextField label="Range To Encrypt" variant="outlined"></TextField>
        <ClickAwayListener onClickAway={handleTooltipClose}>
          <Tooltip
            PopperProps={{
              disablePortal: true,
            }}
            onClose={handleTooltipClose}
            open={openTooltip}
            disableFocusListener
            disableHoverListener
            disableTouchListener
            title="Add comma separate row/colums. use - to specify range"
            placement="right"
          >
            <Button onClick={handleTooltipOpen}>
              <HelpOutlineIcon />
            </Button>
          </Tooltip>
        </ClickAwayListener>
      </Box>
    );
    let x = [p];
    for (let index = 0; index < encrSheetCount; index++) {
      x.push(p);
    }
    x.push(<EgButton text="Add Sheet" onClick={handleAddSheet} />);
    return x;
  };

  const handleAddSheet = () => {
    setEncrSheetCount(encrSheetCount + 1);
  };

  return (
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="Data Encryption"></EgPageTitle>
      <EgInputFile />
      <Typography>{renderText()}</Typography>
      <FormControl component="fieldset">
        {/* <FormLabel component="legend">Gender</FormLabel> */}
        <RadioGroup value={encryptType} onChange={handleEncryptTypeChange}>
          <FormControlLabel
            value="fullEncrypt"
            control={<Radio />}
            label="Encrypt entire file"
          />
          <FormControlLabel
            value="partialEncrypt"
            control={<Radio />}
            label="Let me choose what to encrypt"
          />
        </RadioGroup>
      </FormControl>

      <Typography>{RenderSheetDetailcomp()}</Typography>

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
