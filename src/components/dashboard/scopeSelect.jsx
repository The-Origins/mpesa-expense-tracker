import {
  CalendarMonthRounded,
  DateRangeRounded,
  History,
  QueryBuilder,
} from "@mui/icons-material";
import { Box, Typography, useTheme } from "@mui/material";
import { ReactComponent as Year } from "../../assets/year.svg";
import React from "react";

const ScopeSelect = ({ currentScope, scope, setScope, }) => {
  const theme = useTheme();
  const scopeIcons = {
    today: <QueryBuilder sx={{ fontSize: "1rem" }} />,
    "this week": <DateRangeRounded sx={{ fontSize: "1rem" }} />,
    "this month": <CalendarMonthRounded sx={{ fontSize: "1rem" }} />,
    "this year": <Year height={"16"} width={"16"} />,
    "all time": <History sx={{ fontSize: "1rem" }} />,
  };

  return (
    <button
      onClick={() => setScope(scope)}
      style={{
        width: "100%",
        border: "none",
        background: "transparent",
        cursor: "pointer",
        padding: "0px",
      }}
    >
      <Box
        boxShadow={
          currentScope !== scope &&
          `0px 0px 10px 0px ${theme.palette.grey[400]}`
        }
        border={
          currentScope === scope
            ? `1px solid ${theme.palette.primary.main}`
            : "none"
        }
        borderRadius={"10px"}
        display={"flex"}
        alignItems={"center"}
        justifyContent={"center"}
        gap={"5px"}
        padding={"15px"}
        sx={{
          ":hover": {
            color: "primary.main",
            boxShadow: `0px 0px 10px 0px ${theme.palette.grey[500]}`,
          },
        }}
      >
        {scopeIcons[scope]}
        <Typography fontSize={"0.8rem"}>
          {scope.charAt(0).toUpperCase() + scope.substring(1)}
        </Typography>
      </Box>
    </button>
  );
};

export default ScopeSelect;
