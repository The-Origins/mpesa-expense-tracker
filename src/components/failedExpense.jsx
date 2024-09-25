import { Box, Button, TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ExpenseWorker from "../utils/expenseWorker";

const FailedExpense = ({ index, expense, failed, stats, expenses, onSave }) => {
  const theme = useTheme();
  const [form, setForm] = useState({
    expense: "Unkown",
    receipient: expense.info.receipient,
    amount: expense.info.amount !== "null" ? expense.info.amount : "0",
    date:
      expense.info.date !== "Invalid Date" ? dayjs(expense.info.date) : dayjs(),
    ref: expense.info.ref,
  });

  const handleChange = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({
      ...prev,
      date: date,
    }));
  };

  const handleSave = () => {
    const expenseWorker = new ExpenseWorker()
    let newFailed = [...failed];
    newFailed.splice(index, 1);
    const info = expenseWorker.addExpense(stats, expenses, form);
    onSave({ ...info, failed: newFailed });
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Box
        border={`1px solid ${theme.palette.grey[400]}`}
        display={"flex"}
        flexDirection={"column"}
        gap={"20px"}
        padding={"20px"}
        sx={{
          transition: "0.1s",
          "&:hover": {
            borderColor: theme.palette.primary.main,
          },
        }}
      >
        <Box display={"flex"} gap={"10px"}>
          <TextField
            fullWidth
            label="expense"
            name="expense"
            value={form.expense}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="receipient"
            name="receipient"
            value={form.receipient}
            onChange={handleChange}
          />
          <TextField
            fullWidth
            label="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
          />
          <DatePicker
            disableFuture
            label={"Date"}
            sx={{ width: "100%" }}
            value={form.date}
            onChange={handleDateChange}
          />
          <TextField
            fullWidth
            label="ref"
            name="ref"
            value={form.ref}
            onChange={handleChange}
          />
        </Box>
        <TextField
          fullWidth
          multiline
          minRows={5}
          maxRows={8}
          value={expense.receipt}
        />
        <Box display={"flex"} justifyContent={"flex-end"}>
          <Button disableElevation variant={"contained"} onClick={handleSave}>
            Save
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default FailedExpense;
