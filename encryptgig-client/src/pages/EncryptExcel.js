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
import EgEmailInput from "../components/EgEmailInput";
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
import {
  dataURItoBlob,
  base64ToBlob,
  downloadExcelFile,
} from "../utilities/fileUtilities";

const EncryptCSV = (props) => {
  const uploadedFile = useSelector((state) => {
    //alert();
    return state;
  });
  const [sheetNames, setSheetNames] = useState([]);
  const [encryptType, setEncryptType] = useState("fullEncrypt");
  const [encrSheetCount, setEncrSheetCount] = useState(0);
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const [encrDetails, setEncrDetails] = React.useState([]);

  const reader = new FileReader();
  let sheetData = {};

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  const getRowOffset = async (e) => {
    let index = e.target.name.split("_")[1];
    let key = Object.keys(encrDetails[index])[0];

    encrDetails[index][key] = [{ RowOffset: Number(e.target.value) }];
  };
  const getColList = (e) => {
    let index = e.target.name.split("_")[1];
    let key = Object.keys(encrDetails[index])[0];
    let arr = e.target.value.split(",").map(lettersToNumber);
    encrDetails[index][key].push({ Columns: arr });
  };

  const getSheetName = (e, v) => {
    sheetData[v] = "";
    encrDetails.push(sheetData);
  };

  const handleDecrypt = () => {
    var file = uploadedFile.files.file;
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function (evt) {
      var idata = evt.target.result.split(",")[1];
      console.log(file.name);
      let response = await window.WASMGo.decryptXLS(idata);
      downloadExcelFile(response, file.name);
    };
  };

  const handleEncrypt = () => {
    var file = uploadedFile.files.file;
    let objObject = {};

    for (let i = 0; i < encrDetails.length; i++) {
      let k = Object.keys(encrDetails[i])[0];
      objObject[k] = Object.assign({}, ...Object.values(encrDetails[i])[0]);
    }
    console.log("------------> " + JSON.stringify(objObject));
    let email =
      uploadedFile.shareEmail.emailList != null &&
      uploadedFile.shareEmail.emailList.length > 0
        ? uploadedFile.shareEmail.emailList.join(",")
        : "";

    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async function (evt) {
        var idata = evt.target.result.split(",")[1];
        console.log(file.name);
        let response = await window.WASMGo.encryptXLS(
          idata,
          file.name,
          email,
          JSON.stringify(objObject)
        );
        downloadExcelFile(response, file.name);
      };
    }
  };

  const handleEncryptTypeChange = (event) => {
    setEncryptType(event.target.value);
    getSheetNames();
  };

  const getSheetNames = () => {
    var file = uploadedFile.files.file;
    if (file) {
      var reader = new FileReader();
      reader.readAsBinaryString(file);
      reader.onload = async function (evt) {
        let bstr = evt.target.result;
        const wb = XLSX.read(bstr, { type: "binary" });
        setSheetNames(wb.SheetNames);
      };
    }
  };
  const RenderSheetDetailcomp = () => {
    if (encryptType === "fullEncrypt") {
      return;
    }
    let p = (index) => (
      <Box display="flex" flexDirection="row">
        <Autocomplete
          options={sheetNames}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          onChange={(e, v) => getSheetName(e, v)}
          name={"sheetName_" + index}
          renderInput={(params) => (
            <TextField {...params} label="Sheet Name" variant="outlined" />
          )}
        />
        <TextField
          label="Row Offset"
          name={"rowOffset_" + index}
          onChange={(e) => getRowOffset(e)}
          variant="outlined"
        ></TextField>
        <TextField
          label="Columns To Encrypt"
          name={"colList_" + index}
          onChange={(e) => getColList(e)}
          variant="outlined"
        ></TextField>
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
    let x = [p(0)];
    for (let index = 1; index <= encrSheetCount; index++) {
      x.push(p(index));
    }
    x.push(
      <EgButton
        text="Add Sheet"
        disabled={sheetNames.length - 1 <= encrSheetCount}
        onClick={handleAddSheet}
      />
    );
    return x;
  };

  const handleAddSheet = () => {
    setEncrSheetCount(encrSheetCount + 1);
  };

  const lettersToNumber = (letters) => {
    for (var p = 0, n = 0; p < letters.length; p++) {
      n = letters[p].charCodeAt() - 64 + n * 26;
    }
    return n;
  };

  return (
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="Excel Encryption"></EgPageTitle>
      <EgInputFile />
      <EgEmailInput />
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
