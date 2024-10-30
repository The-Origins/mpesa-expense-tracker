import React, { useEffect, useState } from "react";
import {
  Box,
  Collapse,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
  Typography,
} from "@mui/material";
import dayjs from "dayjs";
import { Delete, KeyboardArrowDown } from "@mui/icons-material";

const FailedExpenseComponent = ({
  index,
  expense,
  setFailed,
  addExpense,
  setDeleteModal,
  setExpenseModalInfo,
}) => {
  const [formattedExpense, setFormattedExpense] = useState({});
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const date = dayjs(expense.info.date);
    setFormattedExpense({
      ...expense.info,
      expense: ["unknown"],
      date: date instanceof Date && !isNaN(date) ? date : dayjs(),
    });
  }, [expense]);

  const handleClick = (event) => {
    event.stopPropagation();
    setExpenseModalInfo({
      open: true,
      type: "add",
      onComplete: handleAdd,
      value: formattedExpense,
      disableOptions: true,
    });
  };

  const handleAdd = (expense) => {
    addExpense(expense);
    deleteExpense();
    setOpen(false);
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    setDeleteModal({
      open: true,
      message: `Are you sure you want to delete this expense?`,
      onConfirm: deleteExpense,
    });
  };

  const deleteExpense = () => {
    setFailed((prev) => {
      prev.splice(index, 1);
      return prev;
    });
  };

  const handleExpand = (event) => {
    event.stopPropagation();
    setOpen((prev) => !prev);
  };

  return (
    <>
      <TableRow
        hover
        key={`expense-${index}`}
        selected={open}
        sx={{ ":hover .expense-delete": { opacity: 1 }, color: "error" }}
        onClick={handleClick}
      >
        <TableCell>
          <Tooltip title="see receipt">
            <IconButton onClick={handleExpand}>
              <KeyboardArrowDown />
            </IconButton>
          </Tooltip>
        </TableCell>
        <TableCell width={"250px"}>Unkown</TableCell>
        <TableCell width={"300px"}>
          {formattedExpense.receipient || "N/A"}
        </TableCell>
        <TableCell width={"150px"}>
          {expense.info.amount && !isNaN(expense.info.amount)
            ? "Ksh " + Number(expense.info.amount).toLocaleString()
            : "N/A"}
        </TableCell>
        <TableCell width={"200px"}>
          {expense.info.date && expense.info.date !== "Invalid Date"
            ? dayjs(expense.info.date).format("DD/MM/YYYY")
            : "N/A"}
        </TableCell>
        <TableCell width={"200px"}>{formattedExpense.ref || "N/A"}</TableCell>
        <TableCell padding="none">
          <Tooltip title="delete">
            <IconButton
              className="expense-delete"
              sx={{ transition: "0.1s", opacity: 0 }}
              onClick={handleDelete}
            >
              <Delete />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
          <Collapse in={open} timeout={"auto"} unmountOnExit>
            <Box
              padding={"20px"}
              display={"flex"}
              flexDirection={"column"}
              gap={"10px"}
            >
              <Typography fontSize={"1.1rem"} fontWeight={"bold"}>
                Receipt
              </Typography>
              <Typography>{expense.receipt}</Typography>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </>
  );
};

export default FailedExpenseComponent;
