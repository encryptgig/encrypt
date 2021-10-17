import {
  AppBar,
  Box,
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  Tab,
  Tabs,
} from "@material-ui/core";
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgEmailInput from "../components/EgEmailInput";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import { TabPanel } from "../components/EgTabPanel";
import VpnKeyIcon from "@material-ui/icons/VpnKey";
import EnhancedEncryptionIcon from "@material-ui/icons/EnhancedEncryption";
import SwipeableViews from "react-swipeable-views";
import {
  dataURItoBlob,
  downloadFile,
  downloadZipFile,
} from "../utilities/fileUtilities";
import { globalStyles } from "../styles/global.styles";
import { validateEmail } from "../utilities/emailUtils";
import { validateLogin } from "../utilities/loginUtils";
import { showLogin } from "../Actions/showLoginAction";
import SecurityIcon from "@material-ui/icons/Security";
import EgVideo from "../components/EgVideo";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

// import JsZip from "jszip";
// import FileSaver from "file-saver";
//

const EncryptFile = (props) => {
  const globalClasses = globalStyles();
  const dispatch = useDispatch();
  const uploadedFile = useSelector((state) => state);
  const [fileBlobArray, setFileBolbArray] = useState([]);
  const [completionDialogOpen, setCompletionDialogOpen] = useState(false);
  const [downloadFileName, setDownloadFileName] = useState([]);
  const [tabValue, setTabValue] = React.useState(0);
  const [showEmail, setShowEmail] = React.useState(false);

  const hadleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };

  const handleCheckboxClick = (e) => {
    setShowEmail(e.target.checked);
  };

  const handleChangeIndex = (index) => {
    setTabValue(index);
  };

  const handleCloseDialog = () => {
    setCompletionDialogOpen(false);
  };

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

  const handleClose = () => {
    setCompletionDialogOpen(false);
  };

  const handleLocalDownload = () => {
    for (let i = 0; i < fileBlobArray.length; i++) {
      downloadFile(fileBlobArray[i], downloadFileName[i], true);
    }

    setCompletionDialogOpen(false);
  };
  const uploadFileToCloud = (jsonBlob) => {
    const token = localStorage.getItem("accessToken");
    if (token == null || token.length == 0) {
      alert("Please login again.");
      return;
    }
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "multipart-formdata", bearer: token },
      body: {
        uploadFile: new File([jsonBlob], "name"),
      },
    };

    let url = "http://localhost:8080/files/upload";
    fetch(url, requestOptions)
      .then((response) => response.json())
      .then((data) => {
        console.log("Success " + data);
      })
      .catch((e) => {
        console.log("Error " + e);
      });
  };

  const handleEncrypt = () => {
    let files = uploadedFile.files.file;
    if (!validateLogin()) {
      dispatch(showLogin(true));
      return;
    }
    // let encryptedFiles = [];
    // var zip = new JsZip();
    let email = "";
    if (
      uploadedFile.shareEmail.emailList != null &&
      uploadedFile.shareEmail.emailList.length > 0
    ) {
      for (var x = 0; x < uploadedFile.shareEmail.emailList.length; x++) {
        if (!validateEmail(uploadedFile.shareEmail.emailList[x].trim())) {
          alert(
            "One of the email provided is not valid. Please correct and retry."
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
            fileBlobArray.push(jsonBlob);
            downloadFileName.push(file.name);

            setCompletionDialogOpen(true);

            //uploadFileToCloud(jsonBlob);
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

  return (
    <div className={globalClasses.drawerPadding}>
      <Box display="flex" flexDirection="row">
        <SecurityIcon style={{ marginTop: 15, marginRight: 2 }} />
        <EgPageTitle title="File Encryption" />
      </Box>
      <AppBar
        position="static"
        style={{ width: "97%" }}
        color="default"
        // className={classes.appbar}
      >
        <Tabs
          value={tabValue}
          onChange={hadleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
          aria-label="full width tabs example"
        >
          <Tab label="Encrypt File" icon={<EnhancedEncryptionIcon />} />
          <Tab label="Decrypt File" icon={<VpnKeyIcon />} />
        </Tabs>
      </AppBar>
      <SwipeableViews index={tabValue} onChangeIndex={handleChangeIndex}>
        <TabPanel value={tabValue} index={0}>
          <EgInputFile maxAllowedCount={10} />
          <Box display="flex" flexDirection="row">
            <EgButton text="Encrypt" onClick={handleEncrypt} icon="lock" />
          </Box>
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <EgInputFile maxAllowedCount={10} />
          <Box display="flex" flexDirection="row">
            <EgButton text="Decrypt" onClick={handleDecrypt} icon="unlock" />
          </Box>
        </TabPanel>
      </SwipeableViews>
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About File Encryption"></EgPageTitle>
      <EgTypography>
        <p align="justify">
          <b>
            We don’t let your original files or logs travel over internet or
            network while sharing.{" "}
          </b>{" "}
          <p></p>
          You can encrypt files i.e.{" "}
          <b>
            PDF, Doc, Word, PPT, JPEG, or any file that is text or binary,{" "}
          </b>{" "}
          using our product. For encrypting your file, we use three-layers
          encryption. Note here we don't know which files or keys are used in
          encryption, since all operations will be performed on your local
          browser with web assembly algorithm we've built. Finally, your logs
          don't travel over internet, nor reaches to us. Don't believe? check
          out your browser's log!
        </p>
      </EgTypography>

      <EgVideo />
      <Dialog open={completionDialogOpen} onClose={handleCloseDialog}>
        <DialogTitle id="alert-dialog-slide-title">
          {"Yay! Your Encryption is ready."}
        </DialogTitle>
        <Divider />

        <DialogContent>
          <FormControlLabel
            value="sendMail"
            onChange={handleCheckboxClick}
            control={<Checkbox color="primary" />}
            label="Share with other emails. [This will give decrypt right to these emails.] "
            labelPlacement="end"
          />
          <EgEmailInput disabled={!showEmail} />
          <br />
          <DialogContentText id="alert-dialog-slide-description">
            You can download the encrypted file locally OR you can upload file
            to secure "Engcryptgig cloud", you can easily share & track file
            uploaded on cloud.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <EgButton
            onClick={handleLocalDownload}
            text="Download File"
            icon="none"
          ></EgButton>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default withRouter(EncryptFile);
