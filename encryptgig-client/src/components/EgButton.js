import React from "react";
import { Button, makeStyles, withStyles } from "@material-ui/core";
import LockIcon from '@material-ui/icons/Lock';
import NoEncryptionIcon from '@material-ui/icons/NoEncryption';
import FileCopyIcon from '@material-ui/icons/FileCopy';


const useStyles = makeStyles((theme) => ({
  buttonIcon: {
    height:"13px"
    
  },

  padding1: {
    marginRight: theme.spacing(1),
    marginTop: theme.spacing(1),
    color: "white"
  },
}));

const EgButton = (props) => {
  const classes = useStyles();
  const { text, onClick, disabled, icon } = props; 
  return (
    <Button
      variant="contained"
      component="label"
      color= "primary"
      className={classes.padding1}
      onClick={onClick}
      disabled={disabled}
    >{
      icon === "lock" ?<LockIcon className= {classes.buttonIcon} />: (icon==="unlock"? <NoEncryptionIcon className= {classes.buttonIcon}/>: <FileCopyIcon className= {classes.buttonIcon}/>) 
    }
      
      {text}
    </Button>
  );
};

export default EgButton;
