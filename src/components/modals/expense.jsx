import { Add, Close, Edit, Receipt, UploadFile } from "@mui/icons-material";
import {
  Box,
  Button,
  IconButton,
  Modal,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
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

const ExpenseModal = ({
  type = "add",
  open,
  handleClose,
  value,
  onComplete,
  disableOptions = false,
}) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const formWorker = new FormWorker();
  const [errors, setErrors] = useState({
    receipient: "required",
    amount: "required",
    ref: "required",
  });
  const [touched, setTouched] = useState({});
  const [changed, setChanged] = useState({});
  const [form, setForm] = useState({ date: dayjs() });

  useEffect(() => {
    if (value) {
      setForm({ ...value, date: dayjs(value.date) });
      if (type === "edit") {
        setErrors({});
      } else {
        setErrors({});
        Object.keys(value).forEach((key) => {
          if (!value[key]) {
            setErrors((prev) => ({ ...prev, [key]: "required" }));
          }
        });
      }
    } else {
      setForm({ date: dayjs() });
      setErrors({
        receipient: "required",
        amount: "required",
        ref: "required",
      });
    }
  }, [value, type]);

  const handleFormChange = ({ target }) => {
    setErrors(formWorker.getErrors(errors, target));
    setForm((prev) => ({ ...prev, [target.name]: target.value }));
    if (value) {
      if (String(value[target.name]) !== target.value) {
        setChanged((prev) => ({ ...prev, [target.name]: true }));
      } else {
        setChanged((prev) => {
          const { [target.name]: value, ...rest } = prev;
          return rest;
        });
      }
    }
  };

  const handleDateChange = (date) => {
    setErrors(formWorker.getErrors(errors, { name: "date", value: date }));
    if (value) {
      if (!errors.date) {
        if (new Date(value.date).toISOString() !== date.toISOString()) {
          setChanged((prev) => ({ ...prev, date: true }));
        } else {
          setChanged((prev) => {
            const { date, ...rest } = prev;
            return rest;
          });
        }
      }
    }
    setForm((prev) => ({ ...prev, date }));
  };

  const handleFormSubmit = () => {
    let { date, expense, receipient, ref, ...rest } = form;
    receipient = formWorker.formatString(receipient);
    ref = formWorker.formatString(ref);
    expense = formWorker.formatString(expense, true);
    date = new Date(date).toISOString();
    onComplete({
      ...rest,
      receipient,
      ref,
      date,
      expense,
    });
    dispatch(
      addToDictionary({
        key: receipient,
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
    setChanged({});
    onClose();
  };

  const onClose = () => {
    setTouched({});
    setChanged({});
    handleClose();
  };

  const handleTouched = ({ target }) => {
    setTouched((prev) => ({ ...prev, [target.name]: true }));
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Modal open={open} onClose={onClose}>
        <Box
          width={"min(600px, 90%)"}
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
            <IconButton onClick={onClose}>
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
              {type.charAt(0).toUpperCase() + type.substring(1) + " Expense"}
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
                  setChanged,
                }}
                initialValue={value?.expense}
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
                renderInput={(params) => (
                  <TextField {...params} helperText={errors.date || " "} />
                )}
                sx={{ flexGrow: 1 }}
              />
              <TimePicker
                label="Select Time"
                value={form.date}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField {...params} helperText={errors.date || " "} />
                )}
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
                    onClick={() => navigate("/expenses/receipts/add")}
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
              <Button size="large" variant="outlined" onClick={onClose}>
                Cancel
              </Button>
              <Button
                size="large"
                variant="contained"
                disableElevation
                onClick={handleFormSubmit}
                disabled={
                  Object.keys(errors).length ||
                  (value && type === "edit" && !Object.keys(changed).length)
                }
                startIcon={
                  type === "add" ? <Add /> : type === "edit" ? <Edit /> : null
                }
              >
                {type.charAt(0).toUpperCase() + type.substring(1)}
              </Button>
            </Box>
          </Box>
        </Box>
      </Modal>
    </LocalizationProvider>
  );
};

export default ExpenseModal;
