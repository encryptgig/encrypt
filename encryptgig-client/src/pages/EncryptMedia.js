import React from "react";
import { AppBar, Box, Divider, makeStyles, Tab, Tabs } from "@material-ui/core";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import { dataURItoBlob } from "../utilities/fileUtilities";
import EgEmailInput from "../components/EgEmailInput";
import { globalStyles } from "../styles/global.styles";
import { EgTabbar } from "../components/EgTabbar";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "../components/EgTabPanel";

const useStyles = makeStyles((theme) => ({
  appbar: { marginTop: theme.spacing(2), marginBottom: theme.spacing(2) },
}));

const EncryptMedia = (props) => {
  const uploadedFile = useSelector((state) => state);
  const globalClasses = globalStyles();
  const classes = useStyles();
  const [tabValue, setTabValue] = React.useState(0);
  const handleDecrypt = () => {
    var file = uploadedFile.files.file;
    if (!file) {
      return;
    }
    var reader = new FileReader();
    reader.readAsText(file);
    reader.onload = function (evt) {
      var out = "",
        out = window.WASMGo.decrypt(evt.target.result);

      var jsonBlob = null;
      jsonBlob = dataURItoBlob(out);

      const data = window.URL.createObjectURL(jsonBlob);
      const link = document.createElement("a");
      link.href = data;
      link.download = file.name;

      // this is necessary as link.click() does not work on the latest firefox
      link.dispatchEvent(
        new MouseEvent("click", {
          bubbles: true,
          cancelable: true,
          view: window,
        })
      );

      setTimeout(() => {
        // For Firefox it is necessary to delay revoking the ObjectURL
        window.URL.revokeObjectURL(data);
        link.remove();
      }, 100);
    };
    reader.onerror = function (evt) {
      console.log("error reading file");
    };
  };
  const handleEncrypt = () => {
    var file = uploadedFile.files.file;
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = function (evt) {
        var out = "",
          out = window.WASMGo.encrypt(evt.target.result);

        var jsonBlob = null;
        jsonBlob = new Blob([out]);

        const data = window.URL.createObjectURL(jsonBlob);
        const link = document.createElement("a");
        link.href = data;
        link.download = file.name;

        // this is necessary as link.click() does not work on the latest firefox
        link.dispatchEvent(
          new MouseEvent("click", {
            bubbles: true,
            cancelable: true,
            view: window,
          })
        );

        setTimeout(() => {
          // For Firefox it is necessary to delay revoking the ObjectURL
          window.URL.revokeObjectURL(data);
          link.remove();
        }, 100);
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
            <EgButton text="Encrypt" onClick={handleEncrypt} />
            <EgButton text="decrypt" onClick={handleDecrypt} />
          </Box>
        </TabPanel>
      </SwipeableViews>

      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About Data Encryption"></EgPageTitle>
      <EgTypography>
        <b>We don't let your data travel over internet.</b>
        Test our application with your data and we just secure it. Send this
        secure data anywhere to anu body and they won't be able to see it until
        you want them to see it. Ans say what key is not constant, you can
        reinitialize data encryption key by just entering you master key in home
        menu.
      </EgTypography>
    </div>
  );
};

export default withRouter(EncryptMedia);
