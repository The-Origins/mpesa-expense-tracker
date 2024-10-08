import React, { useEffect, useState } from "react";
import Cell from "./cell";
import { Box, } from "@mui/material";
import dayjs from "dayjs";
import { useDispatch } from "react-redux";
import { addToDictionary } from "../../../state/dictionary";

const ExpenseComponent = ({
  index,
  expense,
  setExpenseUpdates,
  suggestions,
  setSuggestions,
}) => {
  const dispatch = useDispatch();
  const [form, setForm] = useState(expense);

  const handleSave = (name) => {
    if (!form[name].length) {
      return setForm((prev) => ({
        ...prev,
        [name]: expense[name],
      }));
    }
    if (form[name] !== expense[name]) {
      setExpenseUpdates((prev) => ({
        ...prev,
        [index]: form,
      }));
      if (name === "expense") {
        dispatch(
          addToDictionary({
            key: {
              expense: form.expense,
              variant: form.variant,
            },
            value: form.receipient,
          })
        );
      }

      setSuggestions((prev) => {
        const newSuggestions = prev[name].filter(
          (value) => value !== form[name]
        );
        newSuggestions.unshift(form[name]);
        return {
          ...prev,
          [name]: newSuggestions,
        };
      });
    }
  };

  const handleChange = ({ target }) => {
    setForm((prev) => ({
      ...prev,
      [target.name]: target.value,
    }));
  };

  useEffect(() => {
    setForm(expense);
  }, [expense]);
  return (
    <Box display={"flex"}>
      <Cell
        index={`${index}1`}
        enableEdit
        name={"expense"}
        value={form.expense}
        handleChange={handleChange}
        handleSave={handleSave}
        suggestions={suggestions.expense}
        
      />
      <Cell
        index={`${index}2`}
        isGrey
        enableEdit
        name={"receipient"}
        value={form.receipient}
        handleChange={handleChange}
        handleSave={handleSave}
        suggestions={suggestions.receipient}
      />
      <Cell
        index={`${index}3`}
        enableEdit
        name={"amount"}
        value={form.amount}
        handleChange={handleChange}
        handleSave={handleSave}
        format={(value) => "Ksh " + Number(value).toLocaleString("US")}
      />
      <Cell
        index={`${index}4`}
        enableEdit
        isGrey
        name={"date"}
        value={form.date}
        handleChange={handleChange}
        handleSave={handleSave}
        format={(value) => dayjs(value).format("ddd, D MMM YYYY, HH:mm")}
      />
      <Cell
        index={`${index}5`}
        enableEdit
        name={"ref"}
        value={form.ref}
        handleChange={handleChange}
        handleSave={handleSave}
      />
    </Box>
  );
};

export default ExpenseComponent;
