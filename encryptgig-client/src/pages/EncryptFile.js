import { Box, Chip, Container, Divider, TextField } from "@material-ui/core";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgEmailInput from "../components/EgEmailInput";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import { dataURItoBlob, downloadFile } from "../utilities/fileUtilities";
import { globalStyles } from "../styles/global.styles";

// TODO: Alignment of titles
// TODO: Reset page and all states after successful download of encrypted file
// TODO: Encryption successfull notification

const EncryptFile = (props) => {
  const globalClasses = globalStyles();
  const uploadedFile = useSelector((state) => state);
  const handleDecrypt = () => {
    var file = uploadedFile.files.file;

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
        downloadFile(jsonBlob, file.name);
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
    if (file) {
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = async function (evt) {
        try {
          let out = await window.WASMGo.encrypt(
            evt.target.result,
            file.name,
            evt.target.result.length,
            uploadedFile.shareEmail.emailList != null &&
              uploadedFile.shareEmail.emailList.length > 0
              ? uploadedFile.shareEmail.emailList.join(",")
              : ""
          );
          var jsonBlob = null;
          jsonBlob = new Blob([out]);
          downloadFile(jsonBlob, file.name);
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

  return (
    <div className={globalClasses.drawerPadding}>
      <EgPageTitle title="File Encryption"></EgPageTitle>

      <EgInputFile />
      <EgEmailInput />
      <Box display="flex" flexDirection="row">
        <EgButton text="Encrypt" onClick={handleEncrypt} />
        <EgButton text="decrypt" onClick={handleDecrypt} />
      </Box>
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

export default withRouter(EncryptFile);
