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
import * as XLSX from "xlsx";
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
  const uploadedFile = useSelector((state) => {
    //alert();
    return state;
  });
  const [sheetNames, setSheetNames] = useState([]);
  const [encryptType, setEncryptType] = useState("fullEncrypt");
  const [encrSheetCount, setEncrSheetCount] = useState(0);
  const [openTooltip, setOpenTooltip] = React.useState(false);

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
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
          onClick={alert("hey")}
          renderInput={(params) => (
            <TextField {...params} label="Sheet Name" variant="outlined" />
          )}
        />
        <TextField label="Row Offset" variant="outlined"></TextField>
        <TextField label="Columns To Encrypt" variant="outlined"></TextField>
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
    x.push(
      <EgButton
        text="Add Sheet"
        disabled={encrSheetCount < sheetNames.length}
        onClick={handleAddSheet}
      />
    );
    return x;
  };

  const handleAddSheet = () => {
    setEncrSheetCount(encrSheetCount + 1);
  };

  return (
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="Data Encryption"></EgPageTitle>
      <EgInputFile />
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
