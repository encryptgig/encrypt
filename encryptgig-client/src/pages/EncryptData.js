import { AppBar, Box, Divider, Tab, Tabs, TextField } from "@material-ui/core";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import EgButton from "../components/EgButton";
import CopyToClip from "../components/EgCopyToClip";
import EgEmailInput from "../components/EgEmailInput";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import { globalStyles } from "../styles/global.styles";
import fire from "./../configs/firebase-configs";
import { validateEmail } from "../utilities/emailUtils";
import { validateLogin } from "../utilities/loginUtils";
import { showLogin } from "../Actions/showLoginAction";
import SwipeableViews from "react-swipeable-views";
import { TabPanel } from "../components/EgTabPanel";

const EncryptData = (props) => {
  const globalClasses = globalStyles();
  const dispatch = useDispatch();
  const uploadedFile = useSelector((state) => state);
  const [tabValue, setTabValue] = React.useState(0);
  const [encryptionData, setEncryptionData] = React.useState({
    plaintext: "",
    encryptedtext: "",
    encryptInput: "",
    plaintextOutput: "",
  });
  const wasm = window.WASMGo;
  const encrData = async () => {
    let email = "";
    if (!validateLogin()) {
      dispatch(showLogin(true));
      return;
    }

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
    let ans = await wasm.decrypt(encryptionData.encryptInput);
    if (!validateLogin()) {
      dispatch(showLogin(true));
      return;
    }
    setEncryptionData({
      ...encryptionData,
      plaintextOutput: ans,
    });
    fire.analytics().logEvent("data_decryption");
  };
  const hadleTabChange = (e, newValue) => {
    setTabValue(newValue);
  };
  const handleChangeIndex = (index) => {
    setTabValue(index);
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
          <Tab label="Encrypt Data" />
          <Tab label="Decrypt Data" />
        </Tabs>
      </AppBar>
      <SwipeableViews index={tabValue} onChangeIndex={handleChangeIndex}>
        <TabPanel value={tabValue} index={0}>
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
          <EgButton text="Encrypt" onClick={encrData} icon="lock" />
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
          <CopyToClip dataToCopy={encryptionData.encryptedtext} />
        </TabPanel>
        <TabPanel value={tabValue} index={1}>
          <TextField
            label="Encrypted Data"
            style={{ width: "98%" }}
            rows={4}
            multiline
            placeholder="Enter data to encrypt"
            name="encryptInput"
            onChange={(e) => updateEncryptData(e)}
            margin="normal"
            variant="filled"
            value={encryptionData.encryptInput}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <EgButton text="Decrypt" onClick={DecrData} lock="unlock" />
          <TextField
            id="standard-full-width"
            label="Encrypted Data"
            style={{ width: "98%" }}
            multiline
            rows={4}
            placeholder="Enter data to decrypt"
            name="plaintextOutput"
            onChange={(e) => updateEncryptData(e)}
            margin="normal"
            variant="filled"
            value={encryptionData.plaintextOutput}
            InputLabelProps={{
              shrink: true,
            }}
          />
          <CopyToClip dataToCopy={encryptionData.plaintextOutput} />
        </TabPanel>
      </SwipeableViews>
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About Data Encryption"></EgPageTitle>
      <EgTypography>
        <p>
          {" "}
          <b> We don't let your data or file travel over internet.</b>{" "}
        </p>
        Test our application to secure your data. Send this encrypted data to
        anyone and they won't be able to see the data until you give them the
        exclusive permission through adding their emails. Interestingly, the key is not
        constant as everytime you initiate the encyption, a new key will be
        automatically generated and the beauty is you don't even need to
        remember any keys. Also, we'll never know your keys since all the operations
        will be managed automatically in your local browser along with our most secured
        algorithm.
      </EgTypography>
    </div>
  );
};

export default EncryptData;
