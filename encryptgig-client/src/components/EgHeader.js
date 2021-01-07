import React, { useEffect, useState } from "react";
import {
  AppBar,
  Button,
  makeStyles,
  Toolbar,
  Typography,
  withStyles,
} from "@material-ui/core";
import Avatar from "@material-ui/core/Avatar";
import { withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { deepOrange } from "@material-ui/core/colors";
import { userLogout } from "../Actions/userAction";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import StorageIcon from "@material-ui/icons/Storage";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import PersonIcon from "@material-ui/icons/Person";
import FindInPageIcon from "@material-ui/icons/FindInPage";

const useStyles = makeStyles((theme) => ({
  root: {},
  appbarItem: {
    marginRight: theme.spacing(3),
  },
  title: {
    flexGrow: 1,
    marginLeft: theme.spacing(3),
    color: "white",
  },
  headerMenuColor: {
    color: "white",
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
  }, []);

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
    history.push("/Login");
  };

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography color="inherit" variant="h4" className={classes.title}>
            EncryptGig
          </Typography>

          <Button color="inherit" className={classes.headerMenuColor}>
            <FindInPageIcon style={{ fontSize: 19 }}> </FindInPageIcon>
            Docs
          </Button>
          <Button
            color="inherit"
            className={classes.headerMenuColor}
            onClick={(e) => {
              history.push("/AuditLogs");
              handleClose();
            }}
          >
            <StorageIcon style={{ fontSize: 19 }}> </StorageIcon>
            Audit Logs
          </Button>

          {userState.user.email === null ||
          userState.user.email.length === 0 ? (
            <Button
              color="inherit"
              onClick={handleLoginClick}
              className={classes.headerMenuColor}
            >
              <ExitToAppIcon style={{ fontSize: 19 }}> </ExitToAppIcon>
              Sign in
            </Button>
          ) : photo != null && photo.length > 0 ? (
            <Avatar onClick={handleProfileClick} src={photo}></Avatar>
          ) : (
            <Avatar onClick={handleProfileClick} className={classes.orange}>
              {userName != null ? userName.charAt(0) : "U"}
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
                <PersonIcon style={{ fontSize: 19 }}> </PersonIcon>
              </ListItemIcon>
              <ListItemText primary="Profile" />
            </StyledMenuItem>
            <StyledMenuItem onClick={handleLogout}>
              <ListItemIcon>
                <InboxIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Sign Out" style={{ fontSize: 19 }} />
            </StyledMenuItem>
          </StyledMenu>
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default withRouter(EgHeader);
