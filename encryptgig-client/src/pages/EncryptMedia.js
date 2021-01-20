import React from "react";
import { AppBar, Box, Divider, makeStyles, Tab, Tabs } from "@material-ui/core";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import { dataURItoBlob, downloadFile } from "../utilities/fileUtilities";
import EgEmailInput from "../components/EgEmailInput";
import { globalStyles } from "../styles/global.styles";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "../components/EgTabPanel";
import { validateEmail } from "../utilities/emailUtils";
import { validateLogin } from "../utilities/loginUtils";
import { showLogin } from "../Actions/showLoginAction";

const useStyles = makeStyles((theme) => ({
  appbar: { marginTop: theme.spacing(2) },
}));

const EncryptMedia = (props) => {
  const uploadedFile = useSelector((state) => state);
  const globalClasses = globalStyles();
  const dispatch = useDispatch();
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const handleDecrypt = () => {
    var file = uploadedFile.files.file;
    if (!validateLogin()) {
      dispatch(showLogin(true));
      return;
    }
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = async function (evt) {
      try {
        let out = await window.WASMGo.decrypt(evt.target.result, file.name);

        var jsonBlob = null;
        jsonBlob = dataURItoBlob(out);
        downloadFile(jsonBlob, file.name, false);
      } catch (e) {
        alert(e);
      }
    };
    reader.onerror = function (evt) {
      console.log("error reading file");
    };
  };
  const handleEncrypt = () => {
    var file = uploadedFile.files.file;
    if (!validateLogin()) {
      dispatch(showLogin(true));
      return;
    }
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async function (evt) {
        try {
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
          let out = await window.WASMGo.encrypt(
            evt.target.result,
            file.name,
            evt.target.result.length,
            email
          );
          var jsonBlob = null;
          jsonBlob = new Blob([out]);
          downloadFile(jsonBlob, file.name, true);
        } catch (e) {
          alert(e);
        }
      };
      reader.onerror = function (evt) {
        console.log("error reading file");
      };
    } else {
      alert("select file to encrypt");
    }
  };
  const hadleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setTabValue(index);
  };
  return (
    <div className={globalClasses.drawerPadding}>
      {/* <EgTabbar> */}
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
          <Tab label="Image Encryption" />
          <Tab label="Video Encryption" />
          <Tab label="Audio Encryption" />
          {/* </EgTabbar> */}
        </Tabs>
      </AppBar>
      <SwipeableViews index={tabValue} onChangeIndex={handleChangeIndex}>
        <TabPanel value={tabValue} index={0}>
          <EgPageTitle title="Image Encryption"></EgPageTitle>
          <EgInputFile />
          <EgEmailInput />
          <Box display="flex" flexDirection="row">
            <EgButton text="Encrypt" onClick={handleEncrypt} />
            <EgButton text="decrypt" onClick={handleDecrypt} />
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <EgPageTitle title="Video Encryption"></EgPageTitle>
          <EgInputFile />
          <EgEmailInput />
          <Box display="flex" flexDirection="row">
            <EgButton text="Encrypt" onClick={handleEncrypt} />
            <EgButton text="decrypt" onClick={handleDecrypt} />
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <EgPageTitle title="Audio Encryption"></EgPageTitle>
          <EgInputFile />
          <EgEmailInput />
          <Box display="flex" flexDirection="row">
            <EgButton text="Encrypt" onClick={handleEncrypt} icon="lock" />
            <EgButton text="decrypt" onClick={handleDecrypt} icon="unlock" />
          </Box>
        </TabPanel>
      </SwipeableViews>

      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About Media Encryption"></EgPageTitle>
      <EgTypography>
        <b>We don't let your data travel over internet.</b>
        Test our application with your data and we just secure it. Send this
        secure data anywhere to any body and they won't be able to see it until
        you want them to see it.
      </EgTypography>
    </div>
  );
};

export default withRouter(EncryptMedia);
