import React, { useEffect, useState } from "react";
import Cell from "./cell";
import { Box } from "@mui/material";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { addToDictionary, removeFromDictionary } from "../state/dictionary";

const ExpenseComponent = ({
  index,
  expense,
  setExpenseUpdates,
  suggestions,
  setSuggestions,
}) => {
  const dispatch = useDispatch();
  const [previousExpense, setPreviousExpense] = useState(expense.expense);
  const [currentExpense, setCurrentExpense] = useState(expense);

  const handleSave = (name) => {
    if (!currentExpense[name].length) {
      return setCurrentExpense((prev) => ({
        ...prev,
        [name]: expense[name],
      }));
    }
    if (currentExpense[name] !== expense[name]) {
      setExpenseUpdates((prev) => ({
        ...prev,
        [index]: currentExpense,
      }));
      if (name === "expense") {
        dispatch(
          removeFromDictionary({
            key: previousExpense,
            value: currentExpense.receipient,
          })
        );
        dispatch(
          addToDictionary({
            key: currentExpense.expense,
            value: currentExpense.receipient,
          })
        );
        setPreviousExpense(currentExpense.expense);
      }

      setSuggestions((prev) => {
        const newSuggestions = prev[name].filter(
          (value) => value !== currentExpense[name]
        );
        newSuggestions.unshift(currentExpense[name]);
        return {
          ...prev,
          [name]: newSuggestions,
        };
      });
    }
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
      />
      <Cell
        index={`${index}5`}
        enableEdit
        name={"ref"}
        value={currentExpense.ref}
        handleChange={handleChange}
        handleSave={handleSave}
      />
    </Box>
  );
};

export default ExpenseComponent;
