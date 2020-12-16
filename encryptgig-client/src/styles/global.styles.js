import { makeStyles } from "@material-ui/core";

export const globalStyles = makeStyles((theme) => ({
  drawerPadding: {
    paddingLeft: theme.spacing(8),
    ["@media (min-width:768px)"]: {
      // eslint-disable-line no-useless-computed-key
      paddingLeft: "270px",
    },
  },
}));