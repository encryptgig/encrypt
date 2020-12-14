import React, { useEffect, useState } from "react";
import {
  AppBar,
  Box,
  Button,
  Divider,
  IconButton,
  makeStyles,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deepOrange } from "@material-ui/core/colors";
import { userLogin, userLogout } from "../Actions/userAction";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {},
  appbarItem: {
    marginRight: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(3),
  },
  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
    padding: theme.spacing(1),
  },
}));

const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: theme.palette.primary.main,
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

const EgHeader = (props) => {
  const classes = useStyles();
  const { history } = props;
  const dispatch = useDispatch();
  const userState = useSelector((state) => state);
  const [anchorEl, setAnchorEl] = useState(null);
  const [userName, setUserName] = useState("null");
  const [photo, setPhoto] = useState("null");

  useEffect(() => {
    setUserName(localStorage.getItem("userName"));
    setPhoto(localStorage.getItem("photoUrl"));
  });

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    history.push("/Login");
  };

  const handleLogout = () => {
    handleClose();
    localStorage.removeItem("accessToken");
    localStorage.removeItem("userName");
    localStorage.removeItem("photoUrl");
    dispatch(userLogout());
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            EncryptGig
          </Typography>
          <Typography className={classes.appbarItem}>Tutorials</Typography>
          {userName == null || userName.length === 0 ? (
            <Button color="inherit" onClick={handleLoginClick}>
              Login
            </Button>
          ) : photo != null && photo.length > 0 ? (
            <Avatar onClick={handleProfileClick} src={photo}></Avatar>
          ) : (
            <Avatar onClick={handleProfileClick} className={classes.orange}>
              {userName.charAt(0)}
            </Avatar>
          )}
          <StyledMenu
            id="customized-menu"
            anchorEl={anchorEl}
            keepMounted
            open={Boolean(anchorEl)}
            onClose={handleClose}
          >
            <StyledMenuItem>
              <ListItemIcon>
                <SendIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </StyledMenuItem>
            <StyledMenuItem>
              <ListItemIcon>
                <DraftsIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Audit Logs" />
            </StyledMenuItem>
            <StyledMenuItem onClick={handleLogout}>
              <ListItemIcon>
                <InboxIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Log Out" />
            </StyledMenuItem>
          </StyledMenu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(EgHeader);
