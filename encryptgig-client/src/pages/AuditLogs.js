import React, { useEffect, useReducer, useState } from "react";
import EgPageTitle from "../components/EgPageTitle";
import EditIcon from "@material-ui/icons/Edit";
import KeyboardArrowDownIcon from "@material-ui/icons/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@material-ui/icons/KeyboardArrowUp";
import { showSpinner } from "../Actions/spinnerAction";
import { useDispatch } from "react-redux";
import {
  makeStyles,
  Box,
  Typography,
  Table,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableBody,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  IconButton,
  Collapse,
  Tooltip,
  TableFooter,
  TablePagination,
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { globalStyles } from "../styles/global.styles";
import EgEmailInput from "../components/EgEmailInput";
import { validateEmail } from "../utilities/emailUtils";
import { useSelector } from "react-redux";
import { Fragment } from "react";

const useStyles = makeStyles((theme) => ({
  head: { backgroundColor: theme.palette.primary.light, color: "white" },
  table: { paddingRight: theme.spacing(2) },
}));

const GetDate = (epoc) => {
  var d = new Date(0);
  d.setUTCSeconds(epoc);
  return d.toString();
};

const AuditLogs = () => {
  const classes = useStyles();
  const uploadedFile = useSelector((state) => state);
  const globalClasses = globalStyles();
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [addPartyRecord, setAddPartyRecord] = useState(null);
  const [docData, setDocData] = useState([]);
  const dispatch = useDispatch();
  const [dummy, setDummy] = useState(0);
  const [rowOpen, setRowOpen] = useState([]);
  const [openAddParty, setOpenAddParty] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
  const [pageNo, setPageNo] = useState(0);
  const limit = 20;

  useEffect(() => {
    fetchData();
  }, []);

  const handleRemoveEmail = (email, docName, creationDate, creatorEmail) => {
    setOpenDeleteDialog(true);
    setDeleteRecord({
      email: email,
      docName: docName,
      creationDate: creationDate,
      creatorEmail: creatorEmail,
    });
  };
  const handleAddPartyClose = () => {
    setOpenAddParty(false);
  };

  const handleChangePage = (event, newPage) => {
    setPageNo(newPage);
    fetchData();
  };

  const handleAddPartyCloseAgree = () => {
    setOpenAddParty(false);
    console.log(addPartyRecord);
    const token = localStorage.getItem("accessToken");
    if (token == null || token.length == 0) {
      alert("Please login again.");
      return;
    }
    let email = "";

    if (
      uploadedFile.shareEmail.emailList != null &&
      uploadedFile.shareEmail.emailList.length > 0
    ) {
      for (var x = 0; x < uploadedFile.shareEmail.emailList.length; x++) {
        if (!validateEmail(uploadedFile.shareEmail.emailList[x])) {
          alert(
            "One of the email provided is not valid. Please correct and retry."
          );
          return;
        }
      }
      email = uploadedFile.shareEmail.emailList.join(",");
    }
    console.log(email);
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json", bearer: token },
      body: JSON.stringify({
        Doc: {
          Name: addPartyRecord.docName,
          CreatorEmail: addPartyRecord.creatorEmail,
          CreationDate: addPartyRecord.creationDate,
        },
        Party: email,
      }),
    };

    fetch(
      " https://encryptgig-3nere6jg5a-uc.a.run.app/user/docs/party",
      requestOptions
    ).then((response) => {
      setDocData([]);
      fetchData();
      console.log(response);
    });
    setDeleteRecord(null);
  };
  const handleDeleteDialogClose = () => {
    setOpenDeleteDialog(false);
  };
  const handleDeleteDialogCloseAgree = () => {
    setOpenDeleteDialog(false);
    console.log(deleteRecord);
    const token = localStorage.getItem("accessToken");
    if (token == null || token.length == 0) {
      alert("Please login again.");
      return;
    }
    const requestOptions = {
      method: "PATCH",
      headers: { "Content-Type": "application/json", bearer: token },
      body: JSON.stringify({
        Doc: {
          Name: deleteRecord.docName,
          CreatorEmail: deleteRecord.creatorEmail,
          CreationDate: deleteRecord.creationDate,
        },
        Party: deleteRecord.email,
      }),
    };

    fetch(
      " https://encryptgig-3nere6jg5a-uc.a.run.app/user/docs/party",
      requestOptions
    ).then((response) => {
      setDocData([]);
      fetchData();
    });
    setDeleteRecord(null);
  };
  const GetEmails = (stringJson, docName, creationDate, creatorEmail) => {
    let obj = JSON.parse(stringJson);
    let x = Object.keys(obj).map((key, index) => {
      if (obj[key] === true) {
        return (
          <Chip
            key={index}
            label={key}
            onDelete={(e) =>
              handleRemoveEmail(key, docName, creationDate, creatorEmail)
            }
          ></Chip>
        );
      }
    });
    x.push(
      <Chip
        key={creationDate}
        // label="Share"
        icon={<EditIcon />}
        onClick={(e) => {
          handleAddParty(docName, creationDate, creatorEmail);
        }}
      ></Chip>
    );
    return x;
  };
  const handleAddParty = (docName, creationDate, creatorEmail) => {
    setOpenAddParty(true);
    setAddPartyRecord({
      docName: docName,
      creationDate: creationDate,
      creatorEmail: creatorEmail,
    });
  };
  const fetchData = () => {
    dispatch(showSpinner(true));
    const token = localStorage.getItem("accessToken");
    if (token == null || token.length == 0) {
      alert("Please login again.");
      return;
    }
    const headers = { "Content-Type": "application/json", bearer: token };
    fetch(
      "https://encryptgig-3nere6jg5a-uc.a.run.app/user/docs?offset=" +
        pageNo * limit +
        "&limit=" +
        limit,
      { headers }
    )
      .then((response) => response.json())
      .then((data) => {
        setDocData(data);
        let x = [...rowOpen];
        x[data.length - 1] = false;
        x.fill(false);
        setRowOpen(x);
        console.log(data);
        dispatch(showSpinner(false));
      })
      .catch((e) => {
        console.log("Error fetching audit logs" + e);
        dispatch(showSpinner(false));
      });
  };

  return (
    <div className={globalClasses.drawerPadding}>
      <EgPageTitle title="Audit Logs"> </EgPageTitle>
      <TableContainer component={Paper} className={classes.table}>
        <Table aria-label="Document Data">
          <TableHead>
            <TableRow>
              <TableCell className={classes.head} />
              <TableCell className={classes.head}>Document Name</TableCell>
              {/* <TableCell>Creator Email</TableCell> */}
              <TableCell className={classes.head}>Creation Time</TableCell>
              <TableCell className={classes.head}>Shared With</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docData.map((doc, index) => (
              <Fragment key={index}>
                <TableRow>
                  <TableCell>
                    {doc.DecryptAuditRecord !== null ? (
                      <Tooltip
                        title="Detailed Records"
                        aria-label="detailed records"
                      >
                        <IconButton
                          aria-label="expand row"
                          size="small"
                          onClick={() => {
                            console.log(rowOpen);
                            let z = [...rowOpen];
                            z[index] = !rowOpen[index];
                            setRowOpen(z);
                            console.log(rowOpen);
                          }}
                        >
                          {rowOpen[index] === true ? (
                            <KeyboardArrowUpIcon />
                          ) : (
                            <KeyboardArrowDownIcon />
                          )}
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <div></div>
                    )}
                  </TableCell>
                  <TableCell>{doc.Name}</TableCell>
                  {/* <TableCell>{doc.CreatorEmail}</TableCell> */}
                  <TableCell>
                    {GetDate(doc.CreationDate).split("GMT")[0]}
                  </TableCell>
                  <TableCell>
                    {GetEmails(
                      doc.AllowDecryption,
                      doc.Name,
                      doc.CreationDate,
                      doc.CreatorEmail
                    )}
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell
                    style={{ paddingBottom: 0, paddingTop: 0 }}
                    colSpan={3}
                  >
                    <Collapse
                      in={rowOpen[index] === true}
                      timeout="auto"
                      unmountOnExit
                    >
                      <Box margin={1}>
                        <Typography variant="h6" gutterBottom component="div">
                          Decryption History
                        </Typography>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>Decryption Date</TableCell>
                              <TableCell>Decrypted By</TableCell>
                            </TableRow>
                          </TableHead>
                          {doc.DecryptAuditRecord !== null ? (
                            <TableBody>
                              {doc.DecryptAuditRecord.map((doc1) => (
                                <TableRow>
                                  <TableCell>
                                    {
                                      GetDate(doc1.AccessUnixTime).split(
                                        "GMT"
                                      )[0]
                                    }
                                  </TableCell>
                                  <TableCell>{doc1.AccessBy}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          ) : (
                            <div></div>
                          )}
                        </Table>
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </Fragment>
            ))}
          </TableBody>
          <TableFooter>
            <TableRow>
              <TablePagination
                rowsPerPageOptions={[20]}
                colSpan={4}
                count={100}
                rowsPerPage={20}
                page={pageNo}
                SelectProps={{
                  inputProps: { "aria-label": "rows per page" },
                  native: true,
                }}
                onChangePage={handleChangePage}
                // onChangeRowsPerPage={handleChangeRowsPerPage}
                // ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </TableContainer>
      <Dialog
        open={openDeleteDialog}
        onClose={handleDeleteDialogClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Revoke Decryption Access?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            You are about to revoke access to decrypt the file from an email.
            Email owner will no longer be able to decrypt the file/data.
            <br /> Do you want to proceed?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDeleteDialogClose} color="primary" autoFocus>
            Disagree
          </Button>
          <Button onClick={handleDeleteDialogCloseAgree} color="primary">
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={openAddParty}
        onClose={handleAddPartyClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Subscribe</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Add Emails to share document with.
          </DialogContentText>
          <EgEmailInput />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleAddPartyClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleAddPartyCloseAgree} color="primary">
            Share
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
export default AuditLogs;
