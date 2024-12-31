import { Box } from "@mui/material";
import React, { useEffect, useState } from "react";
import BreadCrumbs from "./breadCrumbs";
import StatsBar from "./statsBar";
import { BarChart } from "@mui/x-charts";
import CustomPieChart from "../pieChart";
import { useLocation, useNavigate } from "react-router-dom";
import AppWorker from "../../utils/appWorker";
import { useSelector } from "react-redux";

const Statistics = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const statistics = useSelector((state) => state.statistics);
  const [statsBar, setStatsBar] = useState({ title: "Expenses", total: 0 });
  const [data, setData] = useState({ pie: [], bar: { lables: [], data: [] } });
  const [expand, setExpand] = useState(false);

  useEffect(() => {
    const path = location.pathname.split("/").slice(2);
    const appWorker = new AppWorker();
    const mutableStatistics = JSON.parse(JSON.stringify(statistics));
    setData(appWorker.getPathData(path, mutableStatistics));
  }, [location, navigate, statistics]);

  const handleBarClick = (event, info) => {
    const path = data.bar.lables[info.dataIndex];
    navigate(`${location.pathname}/${path}`);
  };

  return (
    <Box
      height={"100vh"}
      width={"100%"}
      display={"flex"}
      padding={"20px"}
      flexDirection={"column"}
      gap={"20px"}
    >
      <BreadCrumbs />
      <StatsBar statsBar={statsBar} />
      <Box
        display={"flex"}
        flexWrap={"wrap"}
        gap={"10px"}
        height={"100%"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <BarChart
          series={[{ data: data.bar.data }]}
          xAxis={[{ scaleType: "band", data: data.bar.lables }]}
          width={800}
          height={400}
          onItemClick={handleBarClick}
        />
        <CustomPieChart data={data.pie} legend={{ position: "bottom" }} />
      </Box>
    </Box>
  );
};

export default Statistics;
