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

const drawerWidth = 200;

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
    width: theme.spacing(6),
  },
  toolbar: {
    backgroundColor: "white",
    fontSize: "2.5em",
    height: theme.spacing(7),
    ["@media (min-width:768px)"]: {
      // eslint-disable-line no-useless-computed-key
      height: theme.spacing(8),
    },
  },
  iconItem: { fontSize: 30, marginRight: 18 },
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
      width: drawerWidth - 1,
      height: "3em",
      "& span": { fontSize: "1.2em" },
      "& svg": {
        fontSize: "1.4em",
      },
      "&$selected": {
        backgroundColor: theme.palette.primary.light,
        "& span": {
          fontWeight: "700",
          fontSize: "1.2em",
          color: "white",
        },
        "& svg": {
          fontWeight: "700",
          fontSize: "1.6em",
          color: "white",
        },
      },
      "&$selected:hover": {
        backgroundColor: theme.palette.primary.light,
        "& span": {
          fontWeight: "700",
          fontSize: "1.2em",
          color: "white",
        },
        " & svg": {
          fontWeight: "700",
          fontSize: "1.6em",
          color: "white",
        },
      },
      "&:hover": {
        backgroundColor: theme.palette.primary,
        "& span": {
          fontWeight: "700",
          fontSize: "1.2em",
        },
        " & svg": {
          fontWeight: "700",
          fontSize: "1.6em",
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
          <div className={classes.toolbar}></div>
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
              <InsertDriveFileIcon
                className={classes.iconItem}
              ></InsertDriveFileIcon>
              <ListItemText primary="Encrypt File" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2, "EncryptData")}
            >
              <SortByAlphaIcon className={classes.iconItem} />
              <ListItemText primary="Encrypt Data" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3, "EncryptExcel")}
            >
              <DescriptionIcon className={classes.iconItem} />
              <ListItemText primary="Encrypt Excel" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 4, "EncryptMedia")}
            >
              <PermMediaIcon className={classes.iconItem} />
              <ListItemText primary="Encrypt Media" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 5}
              onClick={(event) => handleListItemClick(event, 5, "Contact")}
            >
              <TelegramIcon className={classes.iconItem} />
              <ListItemText primary="Contact" />
            </ListItem>
          </List>
        </Drawer>
      </Router>
    </Fragment>
  );
};

export default withRouter(EgDrawer);
