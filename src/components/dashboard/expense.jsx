import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import expenseIcons from "./expenseIcons";
import { Paid } from "@mui/icons-material";
import AppWorker from "../../utils/appWorker";

const DashboardExpense = ({ key, expense }) => {
  const appWorker = new AppWorker();
  const theme = useTheme();

  return (
    <Box
      key={key}
      display={"flex"}
      gap={"10px"}
      alignItems={"center"}
      padding={"15px"}
      borderRadius={"10px"}
      boxShadow={`0px 0px 10px 0px ${theme.palette.grey[400]}`}
    >
      {expenseIcons[expense.expense[0].toLowerCase()] ? (
        <img
          src={expenseIcons[expense.expense[0].toLowerCase()]}
          alt={`${expense.expense}-icon`}
          width={"24px"}
          height={"24px"}
        />
      ) : (
        <Paid />
      )}
      <Box display={"flex"} flexDirection={"column"} width={"100%"}>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={"5px"}
        >
          <Typography noWrap width={"200px"}>
            {expense.receipient}
          </Typography>
          <Typography color="error" display={"flex"} gap={"5px"}>
            <Typography>-Ksh</Typography>
            <Typography>{expense.amount}</Typography>
          </Typography>
        </Box>
        <Box
          display={"flex"}
          alignItems={"center"}
          justifyContent={"space-between"}
          gap={"5px"}
        >
          <Typography
            noWrap
            sx={{
              width: "200px",
              color: theme.palette.grey[400],
              fontSize: "0.8rem",
            }}
          >
            {expense.expense.join(", ")}
          </Typography>
          <Typography
            sx={{ color: theme.palette.grey[400], fontSize: "0.8rem" }}
          >
            {appWorker.getTimeAgo(expense.date)}
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardExpense;
