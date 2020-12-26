import React, { useEffect, useState } from "react";
import EgPageTitle from "../components/EgPageTitle";
import EditIcon from "@material-ui/icons/Edit";
import {
  makeStyles,
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
} from "@material-ui/core";
import Paper from "@material-ui/core/Paper";
import { globalStyles } from "../styles/global.styles";
import EgEmailInput from "../components/EgEmailInput";
import EgConfirmationDialog from "../components/EgConfirmationDialog";
import { validateEmail } from "../utilities/emailUtils";
import { useSelector } from "react-redux";

const useStyles = makeStyles((theme) => ({}));

const GetDate = (epoc) => {
  var d = new Date(0);
  d.setUTCSeconds(epoc);
  return d.toString();
};

const AuditLogs = () => {
  let i = 0;
  const classes = useStyles();
  const uploadedFile = useSelector((state) => state);
  const globalClasses = globalStyles();
  const [deleteRecord, setDeleteRecord] = useState(null);
  const [addPartyRecord, setAddPartyRecord] = useState(null);
  const [docData, setDocData] = useState([]);
  const [openAddParty, setOpenAddParty] = useState(false);
  const [openDeleteDialog, setOpenDeleteDialog] = useState(false);

  useEffect(() => {
    fetchData();
    i = 0;
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
      i = 0;
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
      i = 0;
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
        key={-1}
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
    //TODO:This is getting called twice fix that by having states
    const token = localStorage.getItem("accessToken");
    if (token == null || token.length == 0) {
      alert("Please login again.");
      return;
    }
    const headers = { "Content-Type": "application/json", bearer: token };
    fetch("https://encryptgig-3nere6jg5a-uc.a.run.app/user/docs", { headers })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setDocData(data);
      });
  };

  return (
    <div className={globalClasses.drawerPadding}>
      <EgPageTitle title="Audit Logs"> </EgPageTitle>
      <TableContainer component={Paper}>
        <Table aria-label="Document Data">
          <TableHead>
            <TableRow>
              <TableCell />
              <TableCell>Document Name</TableCell>
              {/* <TableCell>Creator Email</TableCell> */}
              <TableCell>Creation Time</TableCell>
              <TableCell>Shared With</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {docData.map((doc) => (
              <TableRow key={i++}>
                <TableCell />
                <TableCell>{doc.Name}</TableCell>
                {/* <TableCell>{doc.CreatorEmail}</TableCell> */}
                <TableCell>{GetDate(doc.CreationDate)}</TableCell>
                <TableCell>
                  {GetEmails(
                    doc.AllowDecryption,
                    doc.Name,
                    doc.CreationDate,
                    doc.CreatorEmail
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
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
