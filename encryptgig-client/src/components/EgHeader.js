import React from "react";
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
import { useSelector } from "react-redux";
import { deepOrange } from "@material-ui/core/colors";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import ListItemText from "@material-ui/core/ListItemText";
import InboxIcon from "@material-ui/icons/MoveToInbox";
import DraftsIcon from "@material-ui/icons/Drafts";
import SendIcon from "@material-ui/icons/Send";

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    zIndex: 1,
  },
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
  const userState = useSelector((state) => state);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleProfileClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLoginClick = () => {
    history.push("/Login");
  };
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            EncryptGig
          </Typography>
          <Typography className={classes.appbarItem}>Tutorials</Typography>
          {userState.user.email === null ||
          userState.user.email.length === 0 ? (
            <Button color="inherit" onClick={handleLoginClick}>
              Login
            </Button>
          ) : userState.user.photoURL.length > 0 ? (
            <Avatar
              onClick={handleProfileClick}
              src={userState.user.photoURL}
            ></Avatar>
          ) : (
            <Avatar onClick={handleProfileClick} className={classes.orange}>
              {userState.user.name.charAt(0)}
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
            <StyledMenuItem>
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
