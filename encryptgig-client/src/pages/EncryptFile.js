import { Box, Chip, Container, Divider, TextField } from "@material-ui/core";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgEmailInput from "../components/EgEmailInput";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgSpinner from "../components/EgSpinner";
import EgTypography from "../components/EgTypography";
import { dataURItoBlob } from "../utilities/fileUtilities";

// TODO: Alignment of titles
// TODO: Reset page and all states after successful download of encrypted file
// TODO: Encryption successfull notification

const EncryptFile = (props) => {
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
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="File Encryption"></EgPageTitle>

      <EgInputFile />
      <EgEmailInput />
      <Box display="flex" flexDirection="row">
        <EgButton text="Encrypt" onClick={handleEncrypt} icon="lock"/>
        <EgButton text="decrypt" onClick={handleDecrypt} icon="unlock"/>
      </Box>
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About Data Encryption"></EgPageTitle>
      <EgTypography>
        
      <p><b>We don’t let your data or file travel over internet. </b> </p>
        You can encrypt any of your file i.e. {" "}
        <b>PDF, Doc, Word, PPT, JPEG, Video, Audio, or any file that is text or binary, </b> using our product. For encrypting your file, we use your master password, along with the Google's private key that is also wrapped. Note, even we don't know which files or keys you used since all operations will perform on your local browser with utmost security. Finally, file logs don't travel over internet, not even to us. Don't believe?  You can
        just check your browser's log!

      </EgTypography>
    </div>
  );
};

export default withRouter(EncryptFile);
