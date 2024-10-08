import {
  Box,
  Button,
  Chip,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useState } from "react";
import Cell from "./cell.jsx";
import ExpenseComponent from "./expenseComponent.jsx";
import { Add } from "@mui/icons-material";
import ExpenseAddModal from "../../modals/addExpense.jsx";
import ExpenseWorker from "../../../utils/expenseWorker.js";
import { useDispatch } from "react-redux";
import { addToDictionary } from "../../../state/dictionary.js";

const ExpensesTable = ({
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
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [expenseUpdates, setExpenseUpdates] = useState({});
  const [isExpenseAddModal, setIsExpenseAddModal] = useState(false);

  const onSubmit = () => {
    updateExpenses();
    handleSubmit();
  };

  const addExpense = (expense) => {
    setReceiptExpenses((prev) => [expense, ...prev]);
  };

  const updateExpenses = () => {
    if (Object.keys(expenseUpdates).length) {
      setStatus({ on: true, type: "LOADING", message: "Updating expenses" });
      const expenseWorker = new ExpenseWorker();
      Object.keys(expenseUpdates).forEach((key) => {
        const data = expenseWorker.addExpense(
          receiptStatistics,
          receiptExpenses,
          expenseUpdates[key]
        );
        dispatch(
          addToDictionary({
            key: expenseUpdates[key].receipient,
            value: {
              expense: expenseUpdates[key].expense,
              variant: expenseUpdates[key].variant,
            },
          })
        );
        setReceiptExpenses(data.expenses);
        setReceiptStatistics(data.receiptStatistics);
      });
      setExpenseUpdates({});
      setStatus({ on: false });
    }
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      width={"100%"}
      border={`1px solid ${theme.palette.grey[400]}`}
      borderRadius={"5px"}
    >
      <ExpenseAddModal
        open={isExpenseAddModal}
        setOpen={setIsExpenseAddModal}
        add={addExpense}
        disableOptions
      />
      <Box
        position={"relative"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"10px"}
      >
        <Box display={"flex"} gap={"10px"}>
          <Typography fontWeight={"bold"} fontSize={"1.5rem"}>
            EXPENSES
          </Typography>
          {Boolean(Object.keys(expenseUpdates).length) && (
            <Tooltip title="save">
              <Chip
                label={`${Object.keys(expenseUpdates).length} Edited`}
                variant={"filled"}
                color="success"
                onClick={updateExpenses}
              />
            </Tooltip>
          )}
          {Boolean(receiptFailed.length) && (
            <Chip
              label={`${receiptFailed.length} failed`}
              variant={"outlined"}
              color="error"
              onClick={() => setStage(2)}
            />
          )}
        </Box>
        <Box display={"flex"} gap={"20px"}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={() => setIsExpenseAddModal(true)}
          >
            Add expense
          </Button>
          <Button variant="contained" disableElevation onClick={onSubmit}>
            Submit
          </Button>
        </Box>
      </Box>
      <Box display={"flex"} mr={"10px"}>
        <Cell isBold value={"Expense"} />
        <Cell isGrey isBold value="Receipient" />
        <Box width={"1px"} bgcolor={theme.palette.grey[400]} />
        <Cell isBold value="Amount" />
        <Cell isGrey isBold value="Date" />
        <Cell isBold value="Ref" />
      </Box>
      <Box
        position={"relative"}
        height={"100%"}
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            bgcolor: "transparent",
            width: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "25px",
            bgcolor: theme.palette.grey[300],
          },
          "&::-webkit-scrollbar-thumb:hover": {
            cursor: "pointer",
            bgcolor: theme.palette.grey[400],
          },
        }}
      >
        {receiptExpenses.map((expense, index) => (
          <ExpenseComponent
            {...{
              index,
              expense,
              setExpenseUpdates,
              suggestions,
              setSuggestions,
            }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ExpensesTable;
