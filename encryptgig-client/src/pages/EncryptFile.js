import { Box, Container, Divider } from "@material-ui/core";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";

const EncryptFile = (props) => {
  const uploadedFile = useSelector((state) => state);
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
  function dataURItoBlob(dataURI, callback) {
    // convert base64 to raw binary data held in a string
    // doesn't handle URLEncoded DataURIs - see SO answer #6850276 for code that does this
    var byteString = atob(dataURI.split(",")[1]);

    // separate out the mime component
    // var mimeString = dataURI.split(",")[0].split(":")[1].split(";")[0];

    // write the bytes of the string to an ArrayBuffer
    var ab = new ArrayBuffer(byteString.length);
    var ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }

    // write the ArrayBuffer to a blob, and you're done
    var bb = new Blob([ab]);
    return bb;
  }
  return (
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="Data Encryption"></EgPageTitle>
      <EgInputFile />
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
