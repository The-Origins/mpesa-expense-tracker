import { Box, Button, TextField, Typography } from "@mui/material";
import React, { useState } from "react";
import ExpenseWorker from "../../../utils/expenseWorker";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

const AddReciepts = ({ handleData }) => {
  const navigate = useNavigate();
  const [receipts, setReceipts] = useState("");
  const statistics = useSelector((state) => state.statistics);
  const dictionary = useSelector((state) => state.dictionary);

  const handleChange = ({ target }) => {
    setReceipts(target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const expenseWorker = new ExpenseWorker();
    const mutableStatistics = JSON.parse(JSON.stringify(statistics));

    handleData(
      expenseWorker.fetchExpenses(receipts, dictionary, mutableStatistics)
    );
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
        <Typography fontWeight={"bold"} fontSize={"1.2rem"}>
          Enter Receipts
        </Typography>
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
      <Box display={"flex"} justifyContent={"space-between"} width={"100%"}>
        <Button variant="outlined" onClick={() => navigate("/dashboard")}>
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disableElevation
          disabled={!receipts.length}
        >
          Fetch Expenses
        </Button>
      </Box>
    </form>
  );
};

export default AddReciepts;
