import { Box, Button, TextField, useTheme } from "@mui/material";
import React, { useState } from "react";
import {
  DatePicker,
  LocalizationProvider,
  renderTimeViewClock,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import ExpenseWorker from "../../../utils/expenseWorker";
import FormWorker from "../../../utils/formWorker";
import { useDispatch } from "react-redux";
import { addToDictionary } from "../../../state/dictionary";
import ExpenseField from "../../expenseField";

const FailedExpense = ({
  index,
  expense,
  receiptFailed,
  receiptStatistics,
  receiptExpenses,
  handleData,
}) => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const formWorker = new FormWorker();
  const [errors, setErrors] = useState(
    expense.info.ref ? {} : { ref: "required" }
  );
  const [touched, setTouched] = useState({});
  const [form, setForm] = useState({
    expense: expense.info.expense || "Unkown",
    variant: expense.info.variant,
    receipient: expense.info.receipient || "Unkown",
    amount: expense.info.amount || 0,
    date:
      expense.info.date !== "Invalid Date" ? dayjs(expense.info.date) : dayjs(),
    ref: expense.info.ref,
  });

  const handleChange = ({ target }) => {
    setErrors(formWorker.getErrors(errors, target));
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

  const handleBlur = ({ target }) => {
    setTouched((prev) => ({ ...prev, [target.name]: true }));
  };

  const handleSave = () => {
    const expenseWorker = new ExpenseWorker();
    let newFailed = [...receiptFailed];
    newFailed.splice(index, 1);
    const data = expenseWorker.addExpense(
      receiptStatistics,
      receiptExpenses,
      form
    );
    handleData({ ...data, failed: newFailed });
    dispatch(
      addToDictionary({
        key: form.receipient,
        value: {
          expense: form.expense,
          variant: form.variant,
        },
      })
    );
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
          <ExpenseField
            {...{ form, setForm, errors, setErrors, touched, setTouched }}
          />
          <TextField
            fullWidth
            label="receipient"
            name="receipient"
            value={form.receipient}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.receipient && touched.receipient}
            helperText={errors.receipient && touched.receipient}
          />
          <TextField
            fullWidth
            label="amount"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.receipient && touched.receipient}
            helperText={errors.receipient && touched.receipient}
          />
          <DatePicker
            label="Select Date"
            value={form.date}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
            sx={{ flexGrow: 1 }}
          />
          <TimePicker
            label="Select Time"
            value={form.date}
            onChange={handleDateChange}
            renderInput={(params) => <TextField {...params} />}
            viewRenderers={{
              hours: renderTimeViewClock,
              minutes: renderTimeViewClock,
              seconds: renderTimeViewClock,
            }}
            ampm={false}
            sx={{ flexGrow: 1 }}
          />
          <TextField
            fullWidth
            label="ref"
            name="ref"
            value={form.ref}
            onBlur={handleBlur}
            onChange={handleChange}
            error={errors.receipient && touched.receipient}
            helperText={errors.receipient && touched.receipient}
          />
        </Box>
        <TextField
          aria-readonly
          fullWidth
          multiline
          minRows={5}
          maxRows={8}
          value={expense.receipt}
        />
        <Box display={"flex"} justifyContent={"flex-end"}>
          <Button
            disableElevation
            variant={"contained"}
            onClick={handleSave}
            disabled={Object.keys(errors.length)}
          >
            Save
          </Button>
        </Box>
      </Box>
    </LocalizationProvider>
  );
};

export default FailedExpense;
