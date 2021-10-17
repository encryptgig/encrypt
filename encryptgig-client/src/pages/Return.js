import React from "react";
import { BrowserRouter as Router, withRouter } from "react-router-dom";
import Alert from "@material-ui/lab/Alert";
import queryString from "query-string";
import { globalStyles } from "../styles/global.styles";
import EgPageTitle from "../components/EgPageTitle";
import Paper from "@material-ui/core/Paper";
import {
  makeStyles,
  Box,
  Table,
  TableCell,
  TableContainer,
  TableRow,
  TableBody,
} from "@material-ui/core";

const useStyles = makeStyles((theme) => ({
  AlertMessage: { paddingRight: theme.spacing(2) },
  table: { marginTop: theme.spacing(2) },
}));

const Return = (props) => {
  const globalClasses = globalStyles();
  const classes = useStyles();

  let params = queryString.parse(props.location.search);

  console.log(props);
  console.log(params);
  console.log(params.txStatus.trim());

  return (
    <div className={globalClasses.drawerPadding}>
      <Box flexGrow={1}>
        <EgPageTitle title="Transaction Summary"> </EgPageTitle>
      </Box>
      <Box className={classes.AlertMessage}>
        {params.txStatus.trim() === "SUCCESS" ? (
          <Alert severity="success">
            Congratulation! Your transaction is successfull.
          </Alert>
        ) : (
          <Alert severity="error">Transaction Failed. Please try again!</Alert>
        )}
      </Box>
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="Document Data">
          <TableBody>
            <TableRow>
              <TableCell>Reference Id</TableCell>
              <TableCell>{params.referenceId}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Payment Mode</TableCell>
              <TableCell>{params.paymentMode}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Amount</TableCell>
              <TableCell>{params.orderAmount}</TableCell>
            </TableRow>
            <TableRow>
              <TableCell>Transaction Time</TableCell>
              <TableCell>{params.txTime}</TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default withRouter(Return);
