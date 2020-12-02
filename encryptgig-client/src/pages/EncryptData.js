import { Box, Divider, TextField } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import EgButton from "../components/EgButton";
import CopyToClip from "../components/EgCopyToClip";
import EgEmailInput from "../components/EgEmailInput";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import fire from "./../configs/firebase-configs";

const EncryptData = (props) => {
  const uploadedFile = useSelector((state) => state);
  const [encryptionData, setEncryptionData] = React.useState({
    plaintext: "",
    encryptedtext: "",
  });
  const wasm = window.WASMGo;
  const encrData = async () => {
    let ans = await wasm.encrypt(
      encryptionData.plaintext,
      "plain data",
      encryptionData.plaintext.length,
      uploadedFile.shareEmail.emailList != null &&
        uploadedFile.shareEmail.emailList.length > 0
        ? uploadedFile.shareEmail.emailList.join(",")
        : ""
    );
    setEncryptionData({
      ...encryptionData,
      encryptedtext: ans,
    });
    fire.analytics().logEvent("data_encryption");
  };
  const DecrData = async () => {
    let ans = await wasm.decrypt(encryptionData.encryptedtext);
    setEncryptionData({
      ...encryptionData,
      plaintext: ans,
    });
    fire.analytics().logEvent("data_decryption");
  };

  const updateEncryptData = (event) => {
    setEncryptionData({
      ...encryptionData,
      [event.target.name]: event.target.value,
    });
  };

  const copyToClipPlain = () => {};

  return (
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="Data Encryption"></EgPageTitle>
      <TextField
        label="Plain Data"
        style={{ margin: 8, width: "98%" }}
        rows={6}
        multiline
        placeholder="Enter data to encrypt"
        name="plaintext"
        onChange={(e) => updateEncryptData(e)}
        margin="normal"
        variant="filled"
        value={encryptionData.plaintext}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <EgEmailInput />
      <Box display="flex" flexDirection="row">
        <EgButton text="Encrypt" onClick={encrData} />
        <CopyToClip dataToCopy={encryptionData.plaintext} />
      </Box>
      <TextField
        id="standard-full-width"
        label="Encrypted Data"
        style={{ margin: 8, width: "98%" }}
        multiline
        rows={6}
        placeholder="Enter data to decrypt"
        name="encryptedtext"
        onChange={(e) => updateEncryptData(e)}
        margin="normal"
        variant="filled"
        value={encryptionData.encryptedtext}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <Box display="flex" flexDirection="row">
        <EgButton text="Decrypt" onClick={DecrData} />
        <CopyToClip dataToCopy={encryptionData.encryptedtext} />
      </Box>
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About File Encryption"></EgPageTitle>
      <EgTypography>
        <b>We don't let your data travel over internet.</b>
        You can encrypt any of your file i.e.{" "}
        <b>PDF, jpeg, video or any file that is text or binary,</b> using this
        facility. We somehow use your master password for doing that. You can
        have your peace of mind because your data is encrypted without us
        knowing it. If you don't trust us just check you browser's debug logs
        and believe.
      </EgTypography>
    </div>
  );
};

export default EncryptData;
