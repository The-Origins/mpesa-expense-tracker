import { IconButton, InputAdornment, TextField } from "@mui/material";
import React, { useState } from "react";
import FormWorker from "../../utils/formWorker";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

const ExpenseField = ({
  params,
  autofocus = false,
  style = { width: "200px", flexGrow: 1 },
  form,
  setForm,
  errors,
  setErrors,
  touched,
  setTouched,
}) => {
  const formWorker = new FormWorker();
  const [expenseScope, setExpenseScope] = useState("expense");
  const [helperText, setHelperText] = useState("");
  const [label, setLabel] = useState("Expense");

  const handleChange = ({ target }) => {
    if (target.name === "expense") {
      setErrors((prev) => formWorker.getErrors(prev, target));
      const [variant] = target.value.split(",").slice(1);
      setForm((prev) => ({
        ...prev,
        expense: target.value,
        variant: variant ? variant.trim() : "",
      }));
    } else if (target.name === "variant") {
      setForm((prev) => {
        const [expense] = prev.expense.split(",");
        return {
          ...prev,
          expense: target.value ? expense + ", " + target.value : expense,
          variant: target.value,
        };
      });
    }
  };
  const handleFocus = () => {
    setHelperText(
      "You can seperate expense variants with a comma. E.g. 'Transport, taxi'"
    );
  };

  const switchScope = (scope) => {
    setExpenseScope(scope);
    setLabel(scope.charAt(0).toUpperCase() + scope.slice(1));
  };

  const handleBlur = () => {
    setTouched((prev) => ({ ...prev, expense: true }));
    if (!errors.expense) {
      setHelperText("");
    }
    switchScope("expense");
  };

  return (
    <TextField
      {...params}
      autofocus={autofocus}
      label={label}
      name={expenseScope}
      value={form[expenseScope]}
      onFocus={handleFocus}
      onBlur={handleBlur}
      onChange={handleChange}
      helperText={(touched.expense && errors.expense) || helperText}
      error={errors.expense && touched.expense}
      sx={style}
      slotProps={{
        input: {
          startAdornment: expenseScope === "variant" && (
            <InputAdornment>
              <IconButton onClick={() => switchScope("expense")}>
                <ChevronLeft />
              </IconButton>
            </InputAdornment>
          ),
          endAdornment: Boolean(form.variant) &&
            Boolean(form.variant.length) &&
            expenseScope === "expense" && (
              <InputAdornment>
                <IconButton onClick={() => switchScope("variant")}>
                  <ChevronRight />
                </IconButton>
              </InputAdornment>
            ),
        },
      }}
    />
  );
};

export default ExpenseField;
