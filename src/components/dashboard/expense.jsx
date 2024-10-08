import { Box, Typography, useTheme } from "@mui/material";
import React from "react";
import expenseIcons from "./expenseIcons";
import { Paid } from "@mui/icons-material";
import AppWorker from "../../utils/appWorker";

const DashboardExpense = ({ key, expense }) => {
  const appWorker = new AppWorker()
  const theme = useTheme();

  return (
    <Box
      key={key}
      display={"flex"}
      justifyContent={"space-between"}
      gap={"5px"}
      padding={"15px"}
      borderRadius={"10px"}
      boxShadow={`0px 0px 10px 0px ${theme.palette.grey[400]}`}
    >
      <Box display={"flex"} gap={"10px"} alignItems={"center"}>
        {expenseIcons[expense.expense.toLowerCase()] ? (
          <img
            src={expenseIcons[expense.expense.toLowerCase()]}
            alt={`${expense.expense}-icon`}
            width={"24px"}
            height={"24px"}
          />
        ) : (
          <Paid />
        )}
        <Box display={"flex"} flexDirection={"column"}>
          <Typography noWrap width={"200px"} >
            {expense.receipient}
          </Typography>
          <Typography
            sx={{ color: theme.palette.grey[400], fontSize: "0.8rem" }}
          >
            {expense.expense}
          </Typography>
        </Box>
      </Box>
      <Box display={"flex"} flexDirection={"column"} alignItems={"flex-end"}>
        <Typography color="error" display={"flex"} gap={"5px"}>
          <Typography>-Ksh</Typography>
          <Typography>{expense.amount}</Typography>
        </Typography>
        <Typography sx={{ color: theme.palette.grey[400], fontSize: "0.8rem" }}>
          {appWorker.getTimeAgo(expense.date)}
        </Typography>
      </Box>
    </Box>
  );
};

export default DashboardExpense;
