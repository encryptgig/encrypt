import React, { Fragment, useEffect } from "react";
import clsx from "clsx";
import { makeStyles, useTheme, withStyles } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import { Divider, List, ListItemIcon, ListItemText } from "@material-ui/core";
import MuiListItem from "@material-ui/core/ListItem";
import CssBaseline from "@material-ui/core/CssBaseline";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import InsertDriveFileIcon from "@material-ui/icons/InsertDriveFile";
import SortByAlphaIcon from "@material-ui/icons/SortByAlpha";
import DescriptionIcon from "@material-ui/icons/Description";
import PermMediaIcon from "@material-ui/icons/PermMedia";
import TelegramIcon from "@material-ui/icons/Telegram";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    height: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
    backgroundColor: "white",
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  },
  drawerClose: {
    transition: theme.transitions.create("width", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: "hidden",
    width: theme.spacing(7),
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 0, 0, 0),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    backgroundColor: "primary",
  },
  encryptfile: {
    height: "20px",
    width: "20px",
    color: "#FFFF00",
  },
  EncrFileIcon: {
    color: "#FF0000",
    "&:hover": {
      color: "#0000FF",
    },
  },
}));

const EgDrawer = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(1);
  useEffect(() => {
    const mediaQuery = window.matchMedia("(min-width: 768px)");
    if (mediaQuery.matches) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, []);

  const { history } = props;
  if (
    window.location.pathname === "/Login" ||
    window.location.pathname === "/Register"
  ) {
    return null;
  }

  const handleListItemClick = (event, index, path) => {
    setSelectedIndex(index);
    history.push(path);
  };

  const ListItem = withStyles({
    root: {
      backgroundColor: "#eeeeee",
      paddingTop: "0px",
      width: drawerWidth,
      height: "3em",
      "& span, & svg": {
        fontSize: "1.2em",
      },
      "&$selected": {
        backgroundColor: theme.palette.primary.light,
        "& span, & svg": {
          fontWeight: "700",
          fontSize: "1.2em",
          color: "white",
        },
      },
      "&$selected:hover": {
        backgroundColor: theme.palette.primary.light,
        "& span, & svg": {
          fontWeight: "700",
          fontSize: "1.2em",
          color: "white",
        },
      },
      "&:hover": {
        backgroundColor: theme.palette.primary,
        "& span, & svg": {
          fontWeight: "700",
          fontSize: "1.2em",
        },
      },
    },
    selected: {},
  })(MuiListItem);

  return (
    <Fragment>
      <Router>
        <CssBaseline />
        <Drawer
          variant="permanent"
          className={clsx(classes.drawer, {
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          })}
          classes={{
            paper: clsx({
              [classes.drawerOpen]: open,
              [classes.drawerClose]: !open,
            }),
          }}
        >
          <div className={classes.toolbar}>
            {" "}
            <img
              src={process.env.PUBLIC_URL + "icons/Encryptgig_logo.png"}
              alt="EncryptGig Logo"
              width="240"
              height="64"
            />{" "}
          </div>
          <Divider />
          <List>
            {/* {userState.user.email === null ||
            userState.user.email.length === 0 ? (
              <ListItem
                button
                to="/Login"
                selected={selectedIndex === 0}
                onClick={(event) => handleListItemClick(event, 0, "/Login")}
              >
                <ListItemIcon>
                  <ExitToAppIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
              </ListItem>
            ) : (
              ""
            )} */}
            <ListItem
              button
              //component={}
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1, "EncryptFile")}
            >
              <ListItemIcon>
                <InsertDriveFileIcon
                  style={{ fontSize: 19 }}
                ></InsertDriveFileIcon>
              </ListItemIcon>
              <ListItemText primary="Encrypt File" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2, "EncryptData")}
            >
              <ListItemIcon>
                <SortByAlphaIcon style={{ fontSize: 19 }}> </SortByAlphaIcon>
              </ListItemIcon>
              <ListItemText primary="Encrypt Data" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3, "EncryptExcel")}
            >
              <ListItemIcon>
                <DescriptionIcon style={{ fontSize: 19 }}> </DescriptionIcon>
              </ListItemIcon>
              <ListItemText primary="Encrypt Excel" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 4, "EncryptMedia")}
            >
              <ListItemIcon>
                <PermMediaIcon style={{ fontSize: 19 }}> </PermMediaIcon>
              </ListItemIcon>
              <ListItemText primary="Encrypt Media" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 5}
              onClick={(event) => handleListItemClick(event, 5, "Contact")}
            >
              <ListItemIcon>
                <TelegramIcon style={{ fontSize: 19 }}></TelegramIcon>
              </ListItemIcon>
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Drawer>
      </Router>
    </Fragment>
  );
};

export default withRouter(EgDrawer);
