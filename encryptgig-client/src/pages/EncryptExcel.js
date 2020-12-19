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
import PropTypes from "prop-types";
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
import { showSpinner } from "../Actions/spinnerAction";
import { useDispatch } from "react-redux";
import {
  dataURItoBlob,
  base64ToBlob,
  downloadExcelFile,
} from "../utilities/fileUtilities";

const useStyles = makeStyles((theme) => ({
  appbar: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
  sheetDataClass: { marginTop: theme.spacing(1) },
  rightMargin: { marginRight: theme.spacing(1) },
}));
function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`wrapped-tabpanel-${index}`}
      aria-labelledby={`wrapped-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={2}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const EncryptCSV = (props) => {
  const uploadedFile = useSelector((state) => {
    //alert();
    return state;
  });
  const theme = useTheme();
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const [sheetNames, setSheetNames] = useState([]);
  const [sheetCount, setSheetCount] = useState(0);
  const [encryptType, setEncryptType] = useState("fullEncrypt");
  const [encrSheetCount, setEncrSheetCount] = useState(0);
  const [openTooltip, setOpenTooltip] = React.useState(false);
  const [encrDetails, setEncrDetails] = React.useState([]);
  const dispatch = useDispatch();

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
    dispatch(showSpinner( true));
    var reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async function (evt) {
      var idata = evt.target.result.split(",")[1];
      console.log(file.name);
      let response = await window.WASMGo.decryptXLS(idata);
      dispatch(showSpinner(false));
      downloadExcelFile(response, file.name);
    };
  };

  const handleEncrypt = () => {
    var file = uploadedFile.files.file;
    let objObject = {};
    dispatch(showSpinner( true));
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
        dispatch(showSpinner( false));

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
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="Excel Encryption"></EgPageTitle>
      <AppBar position="static" color="default" className={classes.appbar}>
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
            <EgButton text="Encrypt" onClick={handleEncrypt} diabled = {false} icon="lock"/>
           
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1} dir={theme.direction}>
          <EgInputFile />
          <EgButton text="decrypt" onClick={handleDecrypt} icon="unlock"/>
        </TabPanel>
      </SwipeableViews>
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About excel Encryption"></EgPageTitle>
      <EgTypography>
        <b>You can encrypt any column and/or row in your excel OR even entire excel file!</b>
       <p> We tokenize the data at row and column level. Additionally, you can restrict whom you wish to give decryption access by adding email ids during encryption. 
        Trust the size of data doesn't change while decryption. Now, protect your excel files while sharing and be assuared of data safety. </p>
      </EgTypography>
    </div>
  );
};

export default withRouter(EncryptCSV);
