import { Box, Button } from "@mui/material";
import React, { useEffect, useState } from "react";
import AddReciepts from "./reciepts";
import ExpensesTable from "../expenseTable";
import { useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import StatusComponent from "../../status";
import { setExpenses } from "../../../state/expenses";
import { setFailed } from "../../../state/failed";
import { setStatistics } from "../../../state/statistics";

const ParseReceipts = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const tab = params.get("tab");
  const [path] = location.pathname.split("/").slice(3);
  const expenses = useSelector((state) => state.expenses);
  const [status, setStatus] = useState({ on: false });
  const [receiptExpenses, setReceiptExpenses] = useState([]);
  const [receiptStatistics, setReceiptStatistics] = useState({});
  const [receiptFailed, setReceiptFailed] = useState([]);

  useEffect(() => {
    if (path) {
      if (
        !["add", "edit"].includes(path) ||
        (!receiptExpenses.length && !receiptFailed.length)
      ) {
        navigate("/expenses/receipts/add");
      }
    }
  }, [path, receiptExpenses.length, receiptFailed.length, navigate]);

  const handleReceiptData = (data) => {
    setReceiptExpenses(data.expenses);
    setReceiptStatistics(data.statistics);
    setReceiptFailed(data.failed);
    navigate("/expenses/receipts/edit");
  };
  const handleSubmit = () => {
    setStatus({ on: true, type: "LOADING", message: "Adding expenses" });
    try {
      if (receiptFailed.length) {
        dispatch(setFailed(receiptFailed));
      }
      dispatch(setExpenses([...expenses, ...receiptExpenses]));
      dispatch(setStatistics(receiptStatistics));
      setStatus({
        on: true,
        type: "SUCCESS",
        message: "Expenses added successfully",
        action: () => {
          navigate(`/${tab ? tab : "dashboard"}`);
        },
        actionTitle: "Done",
      });
    } catch (error) {
      setStatus({
        on: true,
        type: "ERROR",
        message: "Failed to add expenses",
        action: () => navigate("/expenses/receipts/edit"),
      });
    }
  };

  const paths = {
    add: <AddReciepts handleReceiptData={handleReceiptData} />,
    edit: (
      <Box width={"100%"} height={"100%"}>
        <ExpensesTable
          failed={receiptFailed}
          setFailed={setReceiptFailed}
          expenses={receiptExpenses}
          setExpenses={setReceiptExpenses}
          statistics={receiptStatistics}
          setStatistics={setReceiptStatistics}
          setStatus={setStatus}
        />
        <Box
          width={"100%"}
          display={"flex"}
          justifyContent={"space-between"}
          padding={"20px"}
        >
          <Button
            size="large"
            variant="outlined"
            onClick={() => navigate(`/${tab ? tab : "dashboard"}`)}
          >
            Cancel
          </Button>
          <Button disableElevation size="large" variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </Box>
      </Box>
    ),
  };

  return (
    <Box display={"flex"} width={"100%"} height={"100vh"} position={"relative"}>
      {status.on && <StatusComponent {...{ status, setStatus }} isAbsolute />}
      <Box width={"100%"} height={"100%"} padding={"30px"}>
        {path && paths[path]}
      </Box>
    </Box>
  );
};

export default ParseReceipts;
