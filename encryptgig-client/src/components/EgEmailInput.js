import React, { useEffect, useState } from "react";
import { Chip, InputAdornment, makeStyles, TextField } from "@material-ui/core";
import { withRouter } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { shareFile } from "../Actions/fileActions";
import SupervisorAccountIcon from '@material-ui/icons/SupervisorAccount';


const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    justifyContent: "center",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.2),
      backgroundColor: "white",
    },
  },
}));

const EgEmailInput = (props) => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const [emailList, setEmailList] = useState([]);
  const [emailString, setEmailString] = useState("");
  const { history, email } = props;

  const handleRemoveEmail = (event) => {
    setEmailList((prev) => {
      return prev.filter((v) => v !== event);
    });
  };
  //TODO: fix error on copy paste multiple emails
  // Email validation
  // Last email not on the state
  // don't allow duplicate
  const inputChange = (event) => {
    setEmailString(event.target.value);

    if (event.target.value.includes(",")) {
      captureEmails();
    }
  };

  const captureEmails = () => {
    let p = emailString.split(",");
    for (let l = 0; l < p.length; l++) {
      if (p[l].length > 0) {
        setEmailList((prev) => {
          let n = [...new Set([...prev, p[l]])];
          dispatch(shareFile(n));
          return n;
        });
      }
    }
    setEmailString(" ");
  };

  return (
    <div>
      <TextField
        style={{ width: "98%" }}
        variant="filled"
        placeholder=" Enter emails to give decryption access. In case of multiple emails, separate them by comma."
        label="Share with emails"
      
        onChange={inputChange}  
        onKeyPress={(e) => {
          if (e.key == "Enter") {
            captureEmails();
            e.preventDefault();
          }
        }}
        value={emailString}
        multiline={true}
        InputProps={{
          startAdornment: emailList.map((item) => (
            <div className={classes.root} key={item}>
               <SupervisorAccountIcon /> 
              <Chip
                key={item}
                label={item}
                onDelete={(e) => handleRemoveEmail(item)}
              />
            </div>
          )),
        }}
      />
    </div>
  );
};

export default withRouter(EgEmailInput);
