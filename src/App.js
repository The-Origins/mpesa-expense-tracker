import React, { useState } from "react";
import { Box } from "@mui/material";
import Reciepts from "./components/reciepts";
import ExpensesTable from "./components/expenseTable";
import StatusComponent from "./components/status";
import FailedExpenseTable from "./components/failedExpenseTable";

const App = () => {
  const [stage, setStage] = useState(0);
  const [status, setStatus] = useState({ on: false });
  const [expenses, setExpenses] = useState({});
  const [stats, setStats] = useState({});
  const [failed, setFailed] = useState([]);

  const updateInfo = (info) => {
    setExpenses(info.expenses);
    setStats(info.stats);
    setFailed(info.failed);
  };

  const handleRecieptsSubmit = (value) => {
    updateInfo(value);
    if (Object.keys(value.expenses).length) {
      setStage(1);
    } else {
      setStage(2);
    }
  };

  const handleExport = () => {
    setStatus({ on: true, type: "LOADING", message: "Uploading Expenses" });
    fetch("http://localhost:3001/api/expenses", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(expenses),
    })
      .then((response) => response.json())
      .then((data) => {
        setStatus({
          on: true,
          type: "SUCCESS",
          message: data.message,
          action: () => setStage(0),
          actionTitle: "Back Home",
        });
      })
      .catch((error) => {
        setStatus({
          on: true,
          type: "ERROR",
          message: `Error Uploading Expenses ${error.message}`,
          action: () => setStage(0),
        });
      });
  };

  const stages = [
    <Reciepts onSubmit={handleRecieptsSubmit} />,
    <ExpensesTable
      {...{
        stats,
        failed,
        expenses,
        setExpenses,
        handleExport,
        setStage,
      }}
    />,
    <FailedExpenseTable
      {...{ stats, expenses, failed, setFailed, setStage }}
      onSave={updateInfo}
    />,
  ];

  return (
    <Box
      height={"100vh"}
      display={"flex"}
      justifyContent={"center"}
      alignItems={"center"}
    >
      <Box
        width={"100%"}
        display={"flex"}
        height={"90vh"}
        justifyContent={"center"}
        alignItems={"center"}
      >
        <Box
          display={"flex"}
          width={"90%"}
          height={"100%"}
          justifyContent={"center"}
          alignItems={"center"}
        >
          {status.on ? (
            <StatusComponent {...{ setStatus, status }} />
          ) : (
            stages[stage]
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default App;
