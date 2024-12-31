import { TrendingDown, TrendingUp } from "@mui/icons-material";
import { Box, Paper, Typography } from "@mui/material";
import React from "react";

const StatsBar = ({ statsBar }) => {
  return (
    <Paper>
      <Box
        width={"100%"}
        padding={"20px"}
        display={"flex"}
        alignItems={"flex-end"}
        flexWrap={"wrap"}
        gap={"20px"}
      >
        <Typography variant="h1" fontSize={"1.4rem"} fontWeight={"bold"}>
          {statsBar.title}
        </Typography>
        <Typography>Total: Ksh {statsBar.total}</Typography>
        {statsBar.percent && <Typography>Average: {statsBar.percent}</Typography>}
        {statsBar.average && <Typography>{statsBar.average}</Typography>}
        {statsBar.trend && (
          <Box display={"flex"} gap={"5px"}>
            {statsBar.trend > 0 ? <TrendingUp /> : <TrendingDown />}
            <Typography>{String(statsBar.trend).replace("-", "")}</Typography>
          </Box>
        )}
      </Box>
    </Paper>
  );
};

export default StatsBar;
