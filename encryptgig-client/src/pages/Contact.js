import React from "react";
import { Box, Divider, TextField, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import EgButton from "../components/EgButton";
import CopyToClip from "../components/EgCopyToClip";
import EgEmailInput from "../components/EgEmailInput";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import fire from "./../configs/firebase-configs";
import { makeStyles } from "@material-ui/core";
import { globalStyles } from "../styles/global.styles";
import { borders } from '@material-ui/system';

const useStyles = makeStyles((theme) => ({
 
  boxcontent: {
    border:  "1px solid lightgrey",
    padding: "8px",
    width: "98%",
    textAlign: "justify"
  }
   

}));

const Contact = () => {
  const classes = useStyles();
  const globalClasses = globalStyles();

  return (
    <div className={globalClasses.drawerPadding}>
      
      <EgPageTitle title="About EncryptGig"> </EgPageTitle>
     <Box className= {classes.boxcontent}>
         <Typography>
         EncryptGig is the team of security experts, who are on a mission to
        develop powerful, scalable and yet simple encryption products for every
        organizations and individuals need. Our algorithm is designed on the
        stateless architecture, which makes it effortlessly scalable in both
        on-premises and various clouds. Further, everytime you trigger the
        encryptions, we rotate the key, hence providing you the most secured way
        to protect your data. Plus, forget the traditional pain to remember and
        maintain your private keys and infrastructure. All the operations will be perfomed in
        backend with three layers of encryption automatically on your local machine. Finally, with EncryptGig, organizations and individuals can scale up
        their data protection at any extent without worrying about any
        security bottlenecks as product comes with best in-build security features in the
        industry. We're truly excited to embark on your critical encryption journey with us!

        <Typography>
          <h4>
            {" "}
            <p>
              {" "}
              For demo sales, and inquiry, etc. write us at{" "}
              <a href="mailto: encryptgig@gmail.com" target="_blank">
                {" "}
                encryptgig@gmail.com
              </a>  
            </p>{" "}
          </h4>
        </Typography>
      </Typography>
      </Box>
    </div>
  );
};
export default Contact;
