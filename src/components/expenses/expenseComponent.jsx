import React, { useEffect, useState } from "react";
import {
  Checkbox,
  IconButton,
  TableCell,
  TableRow,
  Tooltip,
} from "@mui/material";
import dayjs from "dayjs";
import { Delete } from "@mui/icons-material";
import ExpenseWorker from "../../utils/expenseWorker";

const ExpenseComponent = ({
  index,
  page,
  expense,
  selected,
  setSelected,
  setDeleteModal,
  setExpenseModalInfo,
  expenses,
  setExpenses,
  statistics,
  setStatistics,
}) => {
  const expenseWorker = new ExpenseWorker();
  const [isSelected, setIsSelected] = useState(false);

  useEffect(() => {
    if (selected[page]) {
      setIsSelected(selected[page].includes(expense.id));
    } else {
      setIsSelected(false);
    }
  }, [selected, expense, page]);

  const handleCheck = (event) => {
    event.stopPropagation();
    setSelected((prev) => {
      if (prev[page]) {
        if (prev[page].includes(expense.id)) {
          if (prev[page].length > 1) {
            return {
              ...prev,
              [page]: prev[page].filter((id) => id !== expense.id),
              total: prev.total - 1,
            };
          } else {
            const { [page]: value, ...rest } = prev;
            return { ...rest, total: prev.total - 1 };
          }
        } else {
          return {
            ...prev,
            [page]: [...prev[page], expense.id],
            total: prev.total + 1,
          };
        }
      } else {
        return { ...prev, [page]: [expense.id], total: prev.total + 1 };
      }
    });
  };

  const handleClick = (event) => {
    event.stopPropagation();
    setExpenseModalInfo((prev) => ({
      ...prev,
      open: true,
      type: "edit",
      onComplete: handleEdit,
      value: expense,
      disableOptions: true,
    }));
  };

  const handleDelete = (event) => {
    event.stopPropagation();
    setDeleteModal({
      open: true,
      message: `Are you sure you want to delete this expense?`,
      onConfirm: () => {
        const newData = expenseWorker.deleteExpense(
          statistics,
          expenses,
          expense
        );
        setExpenses(newData.expenses);
        setStatistics(newData.statistics);
      },
    });
  };

  const handleEdit = (edit) => {
    const newData = expenseWorker.editExpense(
      statistics,
      expenses,
      expense,
      edit
    );
    setExpenses(newData.expenses);
    setStatistics(newData.statistics);
  };

  return (
    <TableRow
      hover
      key={`${expense.id}-${index}`}
      selected={isSelected}
      sx={{ ":hover .expense-delete": { opacity: 1 } }}
      onClick={handleClick}
    >
      <TableCell>
        <Tooltip title="select">
          <Checkbox checked={isSelected} onClick={handleCheck} />
        </Tooltip>
      </TableCell>
      <TableCell width={"250px"}>
        {expense.expense
          .map((item) => item.charAt(0).toUpperCase() + item.substring(1))
          .join(", ")}
      </TableCell>
      <TableCell width={"300px"}>{expense.receipient}</TableCell>
      <TableCell width={"150px"}>
        Ksh {Number(expense.amount).toLocaleString()}
      </TableCell>
      <TableCell width={"200px"}>
        {dayjs(expense.date).format("MMM DD YYYY, HH:MM")}
      </TableCell>
      <TableCell width={"200px"}>{expense.ref}</TableCell>
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
  );
};

export default ExpenseComponent;
