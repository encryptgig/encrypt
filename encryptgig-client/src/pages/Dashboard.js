import React, { useState, useEffect, used } from "react";
import { useDispatch } from "react-redux";
import { showSpinner } from "../Actions/spinnerAction";
import GaugeChart from "react-gauge-chart";
import { globalStyles } from "../styles/global.styles";
import EgPageTitle from "../components/EgPageTitle";
import { Box, Typography } from "@material-ui/core";

const Dashboard = () => {
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
        console.log(data1);

        setData(data1.DataRemaining);
        setRequests(data1.RequestRemaining);
        dispatch(showSpinner(false));
      })
      .catch((e) => {
        console.log("Error fetching audit logs" + e);
        dispatch(showSpinner(false));
      });
  };

  return (
    <div className={globalStyles().drawerPadding}>
      <EgPageTitle title="Dashboard"></EgPageTitle>
      <Box
        display="flex"
        flexDirection="row"
        style={{ backgroundColor: "#c7c7c7", width: "98%" }}
      >
        <Box
          display="flex"
          flexDirection="column"
          justifyContent="center"
          style={{ width: "48%" }}
        >
          <GaugeChart
            id="encr_data"
            percent={data / 1000000000}
            textColor="#00"
          ></GaugeChart>
          <Typography style={{ paddingLeft: "42%" }}>Data usage</Typography>
        </Box>
        <Box display="flex" flexDirection="column" style={{ width: "48%" }}>
          <GaugeChart
            id="request_count"
            nrOfLevels={20}
            textColor="#00"
            percent={requests / 500}
          />
          <Typography style={{ paddingLeft: "42%" }}>Requests usage</Typography>
        </Box>
      </Box>
    </div>
  );
};

export default Dashboard;
