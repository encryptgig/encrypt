import React, { useState, useEffect, used } from "react";
import { useDispatch } from "react-redux";
import { showSpinner } from "../Actions/spinnerAction";
import GaugeChart from "react-gauge-chart";
import { globalStyles } from "../styles/global.styles";
import EgPageTitle from "../components/EgPageTitle";
import { Box, Typography } from "@material-ui/core";
import EgButton from "../components/EgButton";
import Pricing from "./Pricing";

const Dashboard = ({ history }) => {
  const dispatch = useDispatch();
  const [data, setData] = useState(0);
  const [requests, setRequests] = useState(0);
  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = () => {
    dispatch(showSpinner(true));
    const token = localStorage.getItem("accessToken");
    if (token == null || token.length == 0) {
      alert("Please login again.");
      return;
    }
    const headers = { "Content-Type": "application/json", bearer: token };
    fetch("https://encryptgig-3nere6jg5a-uc.a.run.app/user/quota", { headers })
      .then((response) => response.json())
      .then((data1) => {
        setData(data1.DataRemaining);
        setRequests(data1.RequestRemaining);
        dispatch(showSpinner(false));
      })
      .catch((e) => {
        dispatch(showSpinner(false));
      });
  };

  const GetDisplayData = (data) => {
    if (data > 1000000000) {
      return parseFloat(data / 1000000000).toFixed(2) + " GB";
    }
    if (data > 1000000) {
      return parseFloat(data / 1000000).toFixed(2) + " MB";
    }
    if (data > 1000) {
      return parseFloat(data / 1000).toFixed(2) + " MB";
    }
    return parseFloat(data).toFixed(2) + " Bytes";
  };

  const handleClick = () => {
    history.push("/Pricing");
  };

  return (
    <div className={globalStyles().drawerPadding}>
      <EgPageTitle title="Dashboard"></EgPageTitle>
      <Box
        display="flex"
        flexDirection="row"
        style={{ border: "1px solid black", borderRadius: 15, width: "98%" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          style={{ width: "48%" }}
        >
          <GaugeChart
            id="encr_data"
            arcsLength={[0.2, 0.6, 0.2]}
            percent={data < 10000000 ? 0.1 : 0.5}
            colors={["#EA4228", "#F5CD19", "#5BE12C"]}
            hideText={true}
          ></GaugeChart>
          <Typography style={{ paddingLeft: "38%" }}>Data Remaining</Typography>
          <Typography align="center" style={{ fontSize: 48 }}>
            {GetDisplayData(data)}
          </Typography>
        </Box>
        <Box display="flex" flexDirection="column" style={{ width: "48%" }}>
          <GaugeChart
            id="encr_data"
            arcsLength={[0.2, 0.6, 0.2]}
            percent={requests < 50 ? 0.1 : 0.5}
            colors={["#EA4228", "#F5CD19", "#5BE12C"]}
            hideText={true}
          ></GaugeChart>
          <Typography style={{ paddingLeft: "38%" }}>
            Requests Remaining
          </Typography>
          <Typography align="center" style={{ fontSize: 48 }}>
            {requests}
          </Typography>
        </Box>
      </Box>
      <Box align="center">
        <EgButton text="Recharge" onClick={handleClick} icon=""></EgButton>
      </Box>
    </div>
  );
};

export default Dashboard;
