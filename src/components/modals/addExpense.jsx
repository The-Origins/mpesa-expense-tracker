import { Add, Close, Receipt, UploadFile } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import FormWorker from "../../utils/formWorker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { renderTimeViewClock } from "@mui/x-date-pickers/timeViewRenderers";
import dayjs from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToDictionary } from "../../state/dictionary";
import ExpenseField from "../expenseField";

const AddExpenseModal = ({ open, setOpen, add, disableOptions = false }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formWorker = new FormWorker();
  const [errors, setErrors] = useState({
    receipient: "required",
    amount: "required",
    ref: "required",
  });
  const [touched, setTouched] = useState({});
  const [form, setForm] = useState({ expense: [], date: dayjs() });

  const handleFormChange = ({ target }) => {
    setErrors(formWorker.getErrors(errors, target));
    setForm((prev) => ({ ...prev, [target.name]: target.value }));
  };

  const handleDateChange = (date) => {
    setForm((prev) => ({ ...prev, date }));
  };

  const handleFormSubmit = () => {
    let { date, expense, ...rest } = form;
    const formattedForm = formWorker.formatString(rest);
    expense = formWorker.formatString(expense, true);
    date = new Date(date).toISOString();
    add({
      ...formattedForm,
      date,
      expense,
    });
    dispatch(
      addToDictionary({
        key: formattedForm.receipient,
        value: expense,
      })
    );
    setForm({ expense: [], date: dayjs() });
    setErrors({
      receipient: "required",
      amount: "required",
      ref: "required",
    });
    setTouched({});
    handleClose();
  };

  const handleTouched = ({ target }) => {
    setTouched((prev) => ({ ...prev, [target.name]: true }));
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={handleClose}>
        <Box
          width={"min(600px, 90%)"}
          position={"relative"}
          borderRadius={"10px"}
          bgcolor={"white"}
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
          }}
        >
          <Box
            position={"absolute"}
            width={"100%"}
            top={0}
            display={"flex"}
            padding={"10px"}
            justifyContent={"flex-end"}
          >
            <IconButton onClick={handleClose}>
              <Close />
            </IconButton>
          </Box>
          <Box
            display={"flex"}
            flexDirection={"column"}
            gap={"20px"}
            padding={"30px"}
          >
            <Typography
              fontWeight={"bold"}
              fontSize={"1.2rem"}
              textAlign={"center"}
            >
              Add expense
            </Typography>
            <Box display={"flex"} gap={"10px"} flexWrap={"wrap"}>
              <ExpenseField
                {...{
                  form,
                  setForm,
                  errors,
                  setErrors,
                  touched,
                  setTouched,
                }}
              />
              <TextField
                label="Receipient"
                name="receipient"
                value={form.receipient}
                onBlur={handleTouched}
                onChange={handleFormChange}
                helperText={(touched.receipient && errors.receipient) || " "}
                error={touched.receipient && Boolean(errors.receipient)}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="Amount"
                name="amount"
                type="number"
                value={form.amount}
                onBlur={handleTouched}
                onChange={handleFormChange}
                helperText={(touched.amount && errors.amount) || " "}
                error={touched.amount && Boolean(errors.amount)}
                sx={{ flexGrow: 1 }}
              />
              <TextField
                label="Ref"
                name="ref"
                value={form.ref}
                onBlur={handleTouched}
                onChange={handleFormChange}
                helperText={(touched.ref && errors.ref) || " "}
                error={touched.ref && Boolean(errors.ref)}
                sx={{ flexGrow: 1 }}
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
            </Box>
            {!disableOptions && (
              <>
                <Typography textAlign={"center"}>or</Typography>
                <Box display={"flex"} gap={"20px"}>
                  <Button
                    size="small"
                    fullWidth
                    variant="outlined"
                    startIcon={<Receipt />}
                    onClick={() => navigate("/expenses/receipts")}
                  >
                    Use Receipts
                  </Button>
                  <Button
                    size="small"
                    fullWidth
                    variant="outlined"
                    startIcon={<UploadFile />}
                  >
                    Import from Exel document
                  </Button>
                </Box>
              </>
            )}
            <Box display={"flex"} justifyContent={"space-between"} mt={"20px"}>
              <Button size="large" variant="outlined" onClick={handleClose}>
                Cancel
              </Button>
              <Button
                size="large"
                variant="contained"
                disableElevation
                onClick={handleFormSubmit}
                disabled={Object.keys(errors).length}
                startIcon={<Add />}
              >
                Add
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default AddExpenseModal;
