import {
  Autocomplete,
  TextField,
  Chip,
  Tooltip,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ExpenseField = ({
  style = { width: "200px", flexGrow: 1 },
  autoFocus = false,
  disableLabel = false,
  form,
  setForm,
  touched,
  setTouched,
}) => {
  const dictionary = useSelector((state) => state.dictionary);
  const [inputValue, setInputValue] = useState(""); // Track the input field's value
  const [error, setError] = useState("required"); // Track if the input field has an error
  const [suggestions, setSuggestions] = useState(["Unkown"]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (form.expense && form.expense.length) {
      setError(null);
    } else {
      setError("required");
    }
  }, [form]);

  useEffect(() => {
    if (dictionary && dictionary.expenses) {
      Object.keys(dictionary.expenses).forEach((key) => {
        setSuggestions((prev) => {
          const suggestion = dictionary.expenses[key].join(", ");
          if (!prev.includes(suggestion)) {
            return [...prev, suggestion];
          } else {
            return prev;
          }
        });
      });
    }
  }, [dictionary]);

  const setExpense = (value) => {
    if (typeof value === "function") {
      setForm((prev) => ({ ...prev, expense: value(prev.expense) }));
    } else {
      setForm((prev) => ({ ...prev, expense: value }));
    }
  };

  const handleChange = (event, newChips) => {
    if (event.target.textContent && event.target.textContent.includes(",")) {
      setExpense((prev) => [...prev, ...event.target.textContent.split(",")]);
    } else {
      setExpense(newChips);
    }
  };

  const handleBlur = () => {
    setTouched((prev) => ({ ...prev, expense: true }));
    if (inputValue.trim()) {
      setExpense((prev) => [...prev, inputValue.trim()]);
      setInputValue("");
    }
  };

  // Handle adding values to chips when Enter or comma is pressed
  const handleAddChip = (event) => {
    const value = event.target.value;

    if ((event.key === "Enter" || event.key === ",") && value.trim()) {
      event.preventDefault(); // Prevent form submission or default behavior
      setExpense((prev) => [...prev, value.trim()]); // Add chip
      setInputValue(""); // Clear input field
    }
  };

  // Handle chip deletion
  const handleDeleteChip = (chipToDelete) => {
    setExpense((prev) => prev.filter((chip) => chip !== chipToDelete)); // Remove chip
  };

  return (
    <Tooltip
      title={
        "Separate multiple expenses with a comma or press Enter after each expense. Eg. Transport, Taxi"
      }
      placement="right"
      arrow
      sx={{ bgcolor: "white" }}
    >
      <Autocomplete
        multiple
        freeSolo
        disableClearable
        open={open}
        onOpen={() => setOpen(true)}
        onClose={() => setOpen(false)}
        options={suggestions}
        value={form.expense}
        sx={{ ...style }}
        onChange={handleChange}
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => setInputValue(newInputValue)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              key={index}
              label={option}
              {...getTagProps({ index })}
              onDelete={() => handleDeleteChip(option)}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus={autoFocus}
            variant="outlined"
            label={disableLabel ? "" : "Expense"}
            onBlur={handleBlur}
            onKeyDown={handleAddChip}
            error={touched.expense && Boolean(error)}
            helperText={(touched.expense && error) || " "}
          />
        )}
      />
    </Tooltip>
  );
};

export default ExpenseField;
