import { Box, Typography, useTheme } from "@mui/material";
import React from "react";

const StatsBar = ({ context, stats }) => {
  const theme = useTheme();
  return (
    <Box
      border={`1px solid ${theme.palette.grey[400]}`}
      display={"flex"}
      gap={"10px"}
      alignItems={"center"}
      padding={"10px"}
      sx={{
        borderWidth: "1px 0px",
      }}
    >
      {context && (
        <Typography fontWeight={"bold"} fontSize={"0.8rem"}>
          {context}
        </Typography>
      )}
      <Typography fontSize={"0.8rem"}>
        Total: {"Ksh "}
        {stats.total.toLocaleString(undefined, {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })}
      </Typography>
      <Typography color={theme.palette.grey[500]} fontSize={"0.8rem"}>
        {stats.entries.toLocaleString()}{" "}
        {`entr${stats.entries === 1 ? "y" : "ies"}`}
      </Typography>
    </Box>
  );
};

export default StatsBar;
