import {
  Autocomplete,
  TextField,
  Chip,
  Tooltip,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";

const ExpenseField = ({
  style = { width: "200px", flexGrow: 1 },
  autoFocus = false,
  disableLabel = false,
  disableTooltip = false,
  form,
  setForm,
  touched,
  setTouched,
  errors,
  setErrors,
  initialValue,
  setChanged,
}) => {
  const dictionary = useSelector((state) => state.dictionary);
  const [inputValue, setInputValue] = useState(""); // Track the input field's value
  const [suggestions, setSuggestions] = useState(["unknown"]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (form.expense && form.expense.length) {
      setErrors((prev) => {
        const { expense, ...rest } = prev;
        return rest;
      });
    } else {
      setErrors((prev) => ({ ...prev, expense: "required" }));
    }
  }, [form, setErrors]);

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
    let result;
    if (typeof value === "function") {
      result = value(form.expense || []);
      setForm((prev) => ({ ...prev, expense: result }));
    } else {
      result = value;
      setForm((prev) => ({ ...prev, expense: result }));
    }

    if (initialValue) {
      if (result.join(",") !== initialValue.join(",")) {
        setChanged((prev) => ({ ...prev, expense: true }));
      } else {
        setChanged((prev) => {
          const { expense, ...rest } = prev;
          return rest;
        });
      }
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
        disableTooltip
          ? ""
          : "Separate multiple expenses with a comma or press Enter after each expense. Eg. Transport, Taxi"
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
        value={form.expense || []}
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
        renderOption={(props, option) => (
          <Typography {...props} component={"li"}>
            {option.charAt(0).toUpperCase() + option.substring(1)}
          </Typography>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            autoFocus={autoFocus}
            variant="outlined"
            label={disableLabel ? "" : "Expense"}
            onBlur={handleBlur}
            onKeyDown={handleAddChip}
            error={touched.expense && Boolean(errors.expense)}
            helperText={(touched.expense && errors.expense) || " "}
          />
        )}
      />
    </Tooltip>
  );
};

export default ExpenseField;
