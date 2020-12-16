import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  makeStyles,
  Radio,
  RadioGroup,
  Tab,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@material-ui/core";
import SwipeableViews from "react-swipeable-views";
import * as XLSX from "xlsx";

import EgEmailInput from "../components/EgEmailInput";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { Autocomplete } from "@material-ui/lab";
import React, { useState, make } from "react";
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
  downloadFile,
} from "../utilities/fileUtilities";
import { globalStyles } from "../styles/global.styles";
import { TabPanel } from "../components/EgTabPanel";
import {
  validateEmail,
  validateNumber,
  validateColRange,
} from "../utilities/emailUtils";

const useStyles = makeStyles((theme) => ({
  appbar: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
  sheetDataClass: { marginTop: theme.spacing(1) },
  rightMargin: { marginRight: theme.spacing(1) },
}));

const EncryptCSV = (props) => {
  const uploadedFile = useSelector((state) => {
    //alert();
    return state;
  });
  const theme = useTheme();
  const classes = useStyles();
  const globalClasses = globalStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const [sheetNames, setSheetNames] = useState([]);
  const [sheetCount, setSheetCount] = useState(0);
  const [encryptType, setEncryptType] = useState("fullEncrypt");
  const [encrSheetCount, setEncrSheetCount] = useState(0);
  const [openTooltip, setOpenTooltip] = useState(false);
  const [encrDetails, setEncrDetails] = React.useState([]);

  const reader = new FileReader();
  let sheetData = {};

  const handleTooltipClose = () => {
    setOpenTooltip(false);
  };

  const handleTooltipOpen = () => {
    setOpenTooltip(true);
  };

  const hadleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  const getRowOffset = async (e) => {
    let index = e.target.name.split("_")[1];
    let key = Object.keys(encrDetails[index])[0];
    if (!validateNumber(e.target.value)) {
      alert("Please enter valid row offset.");
      return;
    }
    encrDetails[index][key] = [{ RowOffset: Number(e.target.value) }];
  };
  const getColList = (e) => {
    let index = e.target.name.split("_")[1];
    let key = Object.keys(encrDetails[index])[0];
    if (!validateColRange(e.target.value)) {
      alert("Please enter valid column range.");
      return;
    }
    let arr = e.target.value.split(",");
    let colListFinal = [];
    arr.forEach((element) => {
      if (element.includes("-")) {
        let cols = element.split("-");
        if (cols.length > 2) {
          alert("Please enter valid range");
          return;
        }
        let start = lettersToNumber(cols[0]);
        if (cols[1] != null) {
          let end = lettersToNumber(cols[1]);
          for (var i = start; i <= end; i++) {
            colListFinal.push(i);
          }
        } else {
          return colListFinal.push(start);
        }
      } else {
        colListFinal.push(lettersToNumber(element));
      }
    });
    console.log(colListFinal);
    encrDetails[index][key].push({ Columns: colListFinal });
  };

  const getSheetName = (e, v) => {
    sheetData[v] = "";
    encrDetails.push(sheetData);

    let array = [...sheetNames]; // make a separate copy of the array

    let index = array.indexOf(v);
    if (index !== -1) {
      array.splice(index, 1);
      setSheetNames(array);
    }
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
      downloadFile(base64ToBlob(response), file.name);
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
    let email = "";
    if (
      uploadedFile.shareEmail.emailList != null &&
      uploadedFile.shareEmail.emailList.length > 0
    ) {
      for (var x = 0; x < uploadedFile.shareEmail.emailList.length; x++) {
        if (!validateEmail(uploadedFile.shareEmail.emailList[x])) {
          alert(
            "One of the email provided is not valid. Please correct and retry."
          );
          return;
        }
      }
      email = uploadedFile.shareEmail.emailList.join(",");
    }
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
        downloadFile(base64ToBlob(response), file.name);
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
        setSheetCount(wb.SheetNames.length);
      };
    }
  };
  const RenderSheetDetailcomp = () => {
    if (encryptType === "fullEncrypt") {
      return;
    }
    let p = (index) => (
      <Box
        display="flex"
        flexDirection="row"
        className={classes.sheetDataClass}
      >
        <Autocomplete
          options={sheetNames}
          getOptionLabel={(option) => option}
          style={{ width: 300 }}
          className={classes.rightMargin}
          onChange={(e, v) => getSheetName(e, v)}
          name={"sheetName_" + index}
          renderInput={(params) => (
            <TextField {...params} label="Sheet Name" variant="outlined" />
          )}
        />
        <TextField
          label="Row Offset"
          className={classes.rightMargin}
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
        disabled={sheetCount - 1 <= encrSheetCount}
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
    <div className={globalClasses.drawerPadding}>
      <EgPageTitle title="Excel Encryption"></EgPageTitle>
      <AppBar
        position="static"
        style={{ width: "97%" }}
        color="default"
        className={classes.appbar}
      >
        <Tabs
          value={tabValue}
          onChange={hadleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Encrypt Excel" />
          <Tab label="Decrypt Excel" />
        </Tabs>
      </AppBar>
      <SwipeableViews index={tabValue} onChangeIndex={handleChangeIndex}>
        <TabPanel value={tabValue} index={0} dir={theme.direction}>
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
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1} dir={theme.direction}>
          <EgInputFile />
          <EgButton text="decrypt" onClick={handleDecrypt} />
        </TabPanel>
      </SwipeableViews>
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
