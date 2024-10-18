import { Box } from "@mui/material";
import React, { useState } from "react";
import AddReciepts from "./reciepts";
import ExpensesTable from "./expenseTable";
import FailedExpenseTable from "./failedExpenseTable";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import StatusComponent from "../../status";
import { setExpenses } from "../../../state/expenses";
import { setFailed } from "../../../state/failed";
import { setStatistics } from "../../../state/statistics";

const ParseReceipts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const expenses = useSelector((state) => state.expenses);
  const [status, setStatus] = useState({ on: false });
  const [stage, setStage] = useState(0);
  const [receiptExpenses, setReceiptExpenses] = useState({});
  const [receiptStatistics, setReceiptStatistics] = useState({});
  const [receiptFailed, setReceiptFailed] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  const handleData = (data) => {
    setReceiptExpenses(data.expenses);
    setReceiptStatistics(data.statistics);
    setReceiptFailed(data.failed);
    setSuggestions(data.suggestions);
    setStage(1);
  };

  const handleSubmit = () => {
    setStatus({ on: true, type: "LOADING", message: "Adding expenses" });
    try {
      if (receiptFailed.length) {
        dispatch(setFailed(receiptFailed));
      }
      const combinedExpenses = [...expenses, ...receiptExpenses].sort(
        (a, b) => new Date(b.date) - new Date(a.date)
      );
      dispatch(setExpenses(combinedExpenses));
      dispatch(setStatistics(receiptStatistics));
      setStatus({
        on: true,
        type: "SUCCESS",
        message: "Expenses added successfully",
        action: () => {
          navigate("/dashboard");
        },
        actionTitle: "Go to Dashboard",
      });
    } catch (error) {
      setStatus({
        on: true,
        type: "ERROR",
        message: "Failed to add expenses",
        action: () => setStage(1),
      });
    }
  };

  return (
    <Box display={"flex"} width={"100%"} height={"100vh"} position={"relative"}>
      {status.on && <StatusComponent {...{ status, setStatus }} isAbsolute />}
      <Box width={"100%"} height={"100%"} padding={"40px"}>
        {
          [
            <AddReciepts handleData={handleData} />,
            <ExpensesTable
              {...{
                setStage,
                setStatus,
                receiptFailed,
                receiptExpenses,
                setReceiptExpenses,
                receiptStatistics,
                setReceiptStatistics,
                suggestions,
                setSuggestions,
                handleSubmit,
              }}
            />,
            <FailedExpenseTable
              {...{
                receiptFailed,
                receiptStatistics,
                receiptExpenses,
                setReceiptExpenses,
                setReceiptStatistics,
                setReceiptFailed,
                setStage,
              }}
            />,
          ][stage]
        }
      </Box>
    </Box>
  );
};

export default ParseReceipts;
