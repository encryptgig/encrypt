import React, { Fragment } from "react";
import clsx from "clsx";
import { makeStyles, useTheme } from "@material-ui/core/styles";
import Drawer from "@material-ui/core/Drawer";
import {
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import ExitToAppIcon from "@material-ui/icons/ExitToApp";
import CssBaseline from "@material-ui/core/CssBaseline";

import {
  Route,
  Link,
  BrowserRouter as Router,
  withRouter,
} from "react-router-dom";

const drawerWidth = 240;

const useStyles = makeStyles((theme) => ({
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: "nowrap",
  },
  drawerOpen: {
    width: drawerWidth,
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
    width: theme.spacing(7) + 1,
    [theme.breakpoints.up("sm")]: {
      width: theme.spacing(9) + 1,
    },
  },
  toolbar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    fontSize: "1em",
  },
}));

const EgDrawer = (props) => {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [selectedIndex, setSelectedIndex] = React.useState(0);

  const { history } = props;

  const handleDrawer = () => {
    setOpen(!open);
  };
  const handleListItemClick = (event, index, path) => {
    setSelectedIndex(index);
    history.push(path);
  };

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
          <div className={classes.toolbar}>EncryptGig</div>
          <Divider />
          <List>
            <ListItem
              button
              component={Link}
              to="/Login"
              selected={selectedIndex === 0}
              onClick={(event) => handleListItemClick(event, 0, "/Login")}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 1}
              onClick={(event) => handleListItemClick(event, 1, "EncryptData")}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Encrypt Data" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 2}
              onClick={(event) => handleListItemClick(event, 2, "EncryptFile")}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Encrypt File" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 3}
              onClick={(event) => handleListItemClick(event, 3, "EncryptCSV")}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Encrypt CSV" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 4}
              onClick={(event) => handleListItemClick(event, 4)}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Encrypt Excel" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 5}
              onClick={(event) => handleListItemClick(event, 5)}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="About" />
            </ListItem>
            <ListItem
              button
              //component={}
              selected={selectedIndex === 6}
              onClick={(event) => handleListItemClick(event, 6)}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Contact" />
            </ListItem>
            <ListItem
              button
              component={Link}
              to="/"
              selected={selectedIndex === 7}
              onClick={(event) => {
                localStorage.removeItem("accessToken");
                handleListItemClick(event, 7, "/");
              }}
            >
              <ListItemIcon>
                <ExitToAppIcon />
              </ListItemIcon>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Drawer>
        {/* <div style={{ paddingLeft:"300px", paddingTop:"50px"}}>
        <Button variant="contained" color={theme.primary} onClick={handleDrawer}>open/close</Button>
      </div> */}
      </Router>
    </Fragment>
  );
};

export default withRouter(EgDrawer);
