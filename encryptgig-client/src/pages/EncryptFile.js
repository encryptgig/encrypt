import { Box, Divider } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgEmailInput from "../components/EgEmailInput";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";

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

// import JsZip from "jszip";
// import FileSaver from "file-saver";
//

const EncryptFile = (props) => {
  const globalClasses = globalStyles();
  const dispatch = useDispatch();
  const uploadedFile = useSelector((state) => state);
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

  return (
    <div className={globalClasses.drawerPadding}>
      <Box display="flex" flexDirection="row">
        <SecurityIcon style={{ marginTop: 15, marginRight: 2 }} />
        <EgPageTitle title="File Encryption" />
      </Box>
      <EgInputFile maxAllowedCount={10} />
      <EgEmailInput />
      <Box display="flex" flexDirection="row">
        <EgButton text="Encrypt" onClick={handleEncrypt} icon="lock" />
        <EgButton text="Decrypt" onClick={handleDecrypt} icon="unlock" />
      </Box>
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
    </div>
  );
};

export default withRouter(EncryptFile);
