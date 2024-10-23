import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setExpenses } from "../../state/expenses";
import { setStatistics } from "../../state/statistics";
import { setFailed } from "../../state/failed";
import ExpensesTable from "./expenseTable";
import { Box } from "@mui/material";

const Expenses = () => {
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses);
  const statistics = useSelector((state) => state.statistics);
  const failed = useSelector((state) => state.failed);

  const mutableExpenses = [...expenses];
  const mutableStatistics = JSON.parse(JSON.stringify(statistics));
  const mutableFailed = [...failed];

  const updateExpenses = (expenses) => {
    dispatch(setExpenses(expenses));
  };

  const updateStatistics = (statistics) => {
    dispatch(setStatistics(statistics));
  };

  const updateFailed = (failed) => {
    dispatch(setFailed(failed));
  };

  return (
    <Box width={"100%"} height={"100vh"} padding={"30px"}>
      <ExpensesTable
        expenses={mutableExpenses}
        setExpenses={updateExpenses}
        statistics={mutableStatistics}
        setStatistics={updateStatistics}
        failed={mutableFailed}
        setFailed={updateFailed}
      />
    </Box>
  );
};

export default Expenses;
