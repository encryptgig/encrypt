import { Box, Divider, TextField } from "@material-ui/core";
import React from "react";
import { useSelector } from "react-redux";
import EgButton from "../components/EgButton";
import CopyToClip from "../components/EgCopyToClip";
import EgEmailInput from "../components/EgEmailInput";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import { globalStyles } from "../styles/global.styles";
import fire from "./../configs/firebase-configs";
import { validateEmail } from "../utilities/emailUtils";

const EncryptData = (props) => {
  const globalClasses = globalStyles();
  const uploadedFile = useSelector((state) => state);
  const [encryptionData, setEncryptionData] = React.useState({
    plaintext: "",
    encryptedtext: "",
  });
  const wasm = window.WASMGo;
  const encrData = async () => {
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
    let ans = await wasm.encrypt(
      encryptionData.plaintext,
      "plain data",
      encryptionData.plaintext.length,
      email
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

  return (
    <div className={globalClasses.drawerPadding}>
      <EgPageTitle title="Data Encryption"></EgPageTitle>
      <TextField
        label="Plain Data"
        style={{ width: "98%" }}
        rows={4}
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
        <EgButton text="Encrypt" onClick={encrData} icon="lock" />
        <CopyToClip dataToCopy={encryptionData.plaintext} />
      </Box>
      <TextField
        id="standard-full-width"
        label="Encrypted Data"
        style={{ width: "98%" }}
        multiline
        rows={4}
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
        <EgButton text="Decrypt" onClick={DecrData} lock="unlock" />
        <CopyToClip dataToCopy={encryptionData.encryptedtext} />
      </Box>
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About File Encryption"></EgPageTitle>
      <EgTypography>
        <p>
          {" "}
          <b>We don't let your data or file travel over internet.</b>{" "}
        </p>
        Test our application to secure your data. Send this encrypted data to
        anyone and they won't be able to see it until you give them the
        permission through adding their emails. Interestingly, the key is not
        constant as everytime you initiate the encyption, a new key will be
        automatically generated and the beauty is you don't even need to
        remember any keys, neither we do know your keys since all the operations
        will be managed automatically in the backend with the most secured
        algorithm.
      </EgTypography>
    </div>
  );
};

export default EncryptData;
