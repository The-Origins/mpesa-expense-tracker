import { Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import ExpenseWorker from "../utils/expenseWorker";

const Reciepts = ({ onSubmit }) => {
  const [receipts, setReceipts] = useState("");

  const handleChange = ({ target }) => {
    setReceipts(target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const expenseWorker = new ExpenseWorker()
    onSubmit(expenseWorker.fetchExpenses(receipts));
  };

  return (
    <form
      style={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-end",
        gap: "20px",
      }}
      onSubmit={handleSubmit}
    >
      <Typography width={"100%"}>Enter Receipts</Typography>
      <TextField
        label="Receipts"
        value={receipts}
        onChange={handleChange}
        minRows={10}
        maxRows={20}
        multiline
        fullWidth
      />
      <Button
        type="submit"
        variant="contained"
        disableElevation
        disabled={!receipts.length}
      >
        Fetch Expenses
      </Button>
    </form>
  );
};

export default Reciepts;
