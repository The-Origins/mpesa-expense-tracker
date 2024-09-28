import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import ExpenseWorker from "../utils/expenseWorker";
import samples from "../lib/samples";
import { useSelector } from "react-redux";

const Reciepts = ({ onSubmit }) => {
  const [receipts, setReceipts] = useState("");
  const dictionary = useSelector((state) => state.dictionary);

  const handleChange = ({ target }) => {
    setReceipts(target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const expenseWorker = new ExpenseWorker();
    onSubmit(expenseWorker.fetchExpenses(receipts, dictionary));
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
      <Box
        width={"100%"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
      >
        <Typography width={"100%"}>Enter Receipts</Typography>
        <Button
          variant="outlined"
          onClick={() => setReceipts(samples)}
          size="large"
        >
          Loadsamples
        </Button>
      </Box>
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
