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
import ImageIcon from "@material-ui/icons/Image";
import PersonalVideoIcon from "@material-ui/icons/PersonalVideo";
import AudiotrackIcon from "@material-ui/icons/Audiotrack";
import FileCopyIcon from "@material-ui/icons/FileCopy";
import EgVideo from "../components/EgVideo";

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
    var files = uploadedFile.files.file;
    if (!validateLogin()) {
      dispatch(showLogin(true));
      return;
    }
    files.forEach((file) => {
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
    });
  };
  const handleEncrypt = () => {
    var files = uploadedFile.files.file;
    if (!validateLogin()) {
      dispatch(showLogin(true));
      return;
    }
    let email = "";
    if (
      uploadedFile.shareEmail.emailList != null &&
      uploadedFile.shareEmail.emailList.length > 0
    ) {
      for (var x = 0; x < uploadedFile.shareEmail.emailList.length; x++) {
        if (!validateEmail(uploadedFile.shareEmail.emailList[x].trim())) {
          alert(
            "One of the email provided is not valid. Please correct and retry. "
          );
          return;
        }
      }
      email = uploadedFile.shareEmail.emailList.join(",");
    }
    files.forEach((file) => {
      if (file) {
        var reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = async function (evt) {
          try {
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
    });
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
          <Tab label="Image Encryption" icon={<ImageIcon />} />
          <Tab label="Video Encryption" icon={<PersonalVideoIcon />} />
          <Tab label="Audio Encryption" icon={<AudiotrackIcon />} />
          {/* </EgTabbar> */}
        </Tabs>
      </AppBar>
      <SwipeableViews index={tabValue} onChangeIndex={handleChangeIndex}>
        <TabPanel value={tabValue} index={0}>
          <EgInputFile maxAllowedCount={10} />
          <EgEmailInput />
          <Box display="flex" flexDirection="row">
            <EgButton text="Encrypt" onClick={handleEncrypt} icon="lock" />
            <EgButton text="decrypt" onClick={handleDecrypt} icon="unlock" />
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <EgInputFile maxAllowedCount={10} />
          <EgEmailInput />
          <Box display="flex" flexDirection="row">
            <EgButton text="Encrypt" onClick={handleEncrypt} icon="lock" />
            <EgButton text="decrypt" onClick={handleDecrypt} icon="unlock" />
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={2}>
          <EgInputFile maxAllowedCount={10} />
          <EgEmailInput />
          <Box display="flex" flexDirection="row">
            <EgButton text="Encrypt" onClick={handleEncrypt} icon="lock" />
            <EgButton text="decrypt" onClick={handleDecrypt} icon="unlock" />
          </Box>
        </TabPanel>
      </SwipeableViews>
      <EgVideo />
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About Media Encryption"></EgPageTitle>
      <EgTypography>
        <p align="justify">
          <b>
            Simply encrypt large video and audio files and share with anyone
            securely.
          </b>
          <p></p>
          You can secure big personal and business Videos and Audios files. Give
          others permission to access it and always rollback the permission via
          our Audit feature.
        </p>
      </EgTypography>
    </div>
  );
};

export default withRouter(EncryptMedia);
