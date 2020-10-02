import { Box, Container, Divider } from "@material-ui/core";
import React, { Fragment } from "react";
import { withRouter } from "react-router-dom";
import EgButton from "../components/EgButton";
import EgInputFile from "../components/EgInputFile";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";

const EncryptFile = (props) => {
  return (
    <div style={{ paddingLeft: "270px" }}>
      <EgPageTitle title="Data Encryption"></EgPageTitle>
      <EgInputFile />
      <Box display="flex" flexDirection="row">
        <EgButton text="Encrypt" />
        <EgButton text="decrypt" />
      </Box>
      <Divider style={{ margin: "10px" }} variant="middle" />
      <EgPageTitle title="About Data Encryption"></EgPageTitle>
      <EgTypography>
        <p>
          <b>We don't let your data travel over internet.</b>
          Test our application with your data and we just secure it. Send this
          secure data anywhere to anu body and they won't be able to see it
          until you want them to see it. Ans say what key is not constant, you
          can reinitialize data encryption key by just entering you master key
          in home menu.
        </p>
      </EgTypography>
    </div>
  );
};

export default withRouter(EncryptFile);
