import React from "react";
import { Box, Divider, TextField, Typography } from "@material-ui/core";
import { useSelector } from "react-redux";
import EgButton from "../components/EgButton";
import CopyToClip from "../components/EgCopyToClip";
import EgEmailInput from "../components/EgEmailInput";
import EgPageTitle from "../components/EgPageTitle";
import EgTypography from "../components/EgTypography";
import fire from "./../configs/firebase-configs";
import {makeStyles} from "@material-ui/core";

const useStyles= makeStyles((theme) => ({
    content: {
justifyContent: "centre"

    }}))

const Contact = () =>{

    const classes = useStyles();
    
    return(<div style={{paddingLeft: "270px"}}> 
        
        
    <EgPageTitle title = "About EncryptGig"> </EgPageTitle>
    
    <Typography className= {classes.content}>
    EncryptGig is a team of security experts, who are on a mission to develop powerful, scalable and yet simple encryption products for every organizations and individuals need. 
       Our algorithm is designed on the stateless architecture, which makes it effortlessly scalable in both on-premise and various clouds. 
       Furthermore, everytime you trigger the encryptions, we rotate the key, hence providing you the most secured way to your protect data. 
       Plus, now forget the pain to remember and maintain your private keys for multiple operations. 
       Finally, EncryptGig ensures that all organizations and individuals can scale up their encryption capability to any extent without worrying about any security bottlenecks as product comes with best in-build security in the industry. We're truly excited to embark on your critical encryption journey with us! 
    
    <Typography className= {classes.content}><h3> <p> For demo etc. please send us an email at <a href= "mailto: encryptgig@gmail.com" target= "_blank"> encryptgig@gmail.com</a></p> </h3></Typography>
    </Typography>
    </div>
    )
};
export default Contact;