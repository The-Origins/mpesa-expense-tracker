import React, { useEffect, useState } from "react";
import Cell from "./cell";
import { Box } from "@mui/material";
import dayjs from "dayjs";

const ExpenseComponent = ({
  index,
  expense,
  setExpenseUpdates,
  suggestions,
}) => {
  const [currentExpense, setCurrentExpense] = useState(expense);

  const handleSave = () => {
    setExpenseUpdates((prev) => ({
      ...prev,
      [index]: currentExpense,
    }));
  };

  const handleChange = ({ target }) => {
    setCurrentExpense((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  useEffect(() => {
    setCurrentExpense(expense);
  }, [expense]);
  return (
    <Box display={"flex"}>
      <Cell
        index={`${index}1`}
        enableEdit
        name={"expense"}
        value={currentExpense.expense}
        handleChange={handleChange}
        handleSave={handleSave}
        suggestions={suggestions.expense}
      />
      <Cell
        index={`${index}2`}
        isGrey
        enableEdit
        name={"receipient"}
        value={currentExpense.receipient}
        handleChange={handleChange}
        handleSave={handleSave}
        suggestions={suggestions.receipient}
      />
      <Cell
        index={`${index}3`}
        enableEdit
        name={"amount"}
        value={currentExpense.amount}
        handleChange={handleChange}
        handleSave={handleSave}
        format={(value) => "Ksh " + Number(value).toLocaleString("US")}
        suggestions={suggestions.amount}
      />
      <Cell
        index={`${index}4`}
        enableEdit
        isGrey
        name={"date"}
        value={currentExpense.date}
        handleChange={handleChange}
        handleSave={handleSave}
        format={(value) => dayjs(value).format("ddd, D MMM YYYY, HH:mm")}
        suggestions={suggestions.date}
      />
      <Cell
        index={`${index}5`}
        enableEdit
        name={"ref"}
        value={currentExpense.ref}
        handleChange={handleChange}
        handleSave={handleSave}
        suggestions={suggestions.ref}
      />
    </Box>
  );
};

export default ExpenseComponent;
