import { Divider, TextField } from "@material-ui/core";
import React from "react";
import EgButton from "../components/EgButton";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";

const EncryptData = (props) => {
  const [encryptionData, setEncryptionData] = React.useState({
    plaintext: "",
    encryptedtext: "",
  });
  const wasm = window.WASMGo;
  const encrData = () => {
    let ans = wasm.encrypt(encryptionData.plaintext);
    setEncryptionData({
      ...encryptionData,
      encryptedtext: ans,
    });
  };
  const DecrData = () => {
    let ans = wasm.decrypt(encryptionData.encryptedtext);
    console.log(ans);
    setEncryptionData({
      ...encryptionData,
      plaintext: ans,
    });
  };

  const updateEncryptData = (event) => {
    setEncryptionData({
      ...encryptionData,
      [event.target.name]: event.target.value,
    });
  };

  return (
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="Encrypt File"></EgPageTitle>
      <TextField
        label="Plain Data"
        style={{ margin: 8 }}
        rows={4}
        multiline
        placeholder="Enter data to encrypt"
        name="plaintext"
        fullWidth
        onChange={(e) => updateEncryptData(e)}
        margin="normal"
        variant="filled"
        value={encryptionData.plaintext}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <EgButton text="Encrypt" onClick={encrData} />
      <TextField
        id="standard-full-width"
        label="Encrypted Data"
        style={{ margin: 8 }}
        multiline
        rows={4}
        placeholder="Enter data to decrypt"
        name="encryptedtext"
        fullWidth
        onChange={(e) => updateEncryptData(e)}
        margin="normal"
        variant="filled"
        value={encryptionData.encryptedtext}
        InputLabelProps={{
          shrink: true,
        }}
      />
      <EgButton text="Decrypt" onClick={DecrData} />
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About File Encryption"></EgPageTitle>
      <EgTypography>
        <p>
          <b>We don't let your data travel over internet.</b>
          You can encrypt any of your file i.e.{" "}
          <b>PDF, jpeg, video or any file that is text or binary,</b> using this
          facility. We somehow use your master password for doing that. You can
          have your peace of mind because your data is encrypted without us
          knowing it. If you don't trust us just check you browser's debug logs
          and believe.
        </p>
      </EgTypography>
    </div>
  );
};

export default EncryptData;
