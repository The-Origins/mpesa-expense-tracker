import {
  Box,
  Button,
  Chip,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import Cell from "./cell.jsx";
import ExpenseComponent from "./expenseComponent.jsx";
import StatsBar from "./statsBar.jsx";

const ExpensesTable = ({
  setStage,
  stats,
  failed,
  expenses,
  setExpenses,
  handleExport,
}) => {
  const theme = useTheme();
  const [selectedYear, setSelectedYear] = useState(Object.keys(expenses)[0]);
  const [selectedMonth, setSelectedMonth] = useState(
    Object.keys(expenses[selectedYear])[0]
  );
  const [suggestions, setSuggestions] = useState({
    expense: [],
    receipient: [],
    amount: [],
    date: [],
    ref: [],
  });
  const [expenseUpdates, setExpenseUpdates] = useState({});

  useEffect(() => {
    expenses[selectedYear][selectedMonth].forEach((expense) => {
      Object.keys(expense).forEach((key) => {
        setSuggestions((prev) => {
          if (!prev[key].includes(String(expense[key]))) {
            return {
              ...prev,
              [key]: [...prev[key], String(expense[key])],
            };
          }
          return prev;
        });
      });
    });
  }, [expenses, selectedYear, selectedMonth]);

  const onExport = () => {
    updateExpenses();
    handleExport();
  };

  const updateExpenses = () => {
    if (Object.keys(expenseUpdates).length) {
      setExpenses((prev) => {
        let newExpenses = [...prev[selectedYear][selectedMonth]];
        Object.keys(expenseUpdates).forEach((upate) => {
          newExpenses[upate] = expenseUpdates[upate];
        });
        return {
          ...prev,
          [selectedYear]: {
            ...prev[selectedYear],
            [selectedMonth]: newExpenses,
          },
        };
      });
      setExpenseUpdates({});
    }
  };

  const handleSelectYear = (year) => {
    updateExpenses();
    setSelectedYear(year);
    setSelectedMonth(Object.keys(expenses[year])[0]);
  };

  const handleSelectMonth = (month) => {
    updateExpenses();
    setSelectedMonth(month);
  };

  return (
    <Box
      display={"flex"}
      flexDirection={"column"}
      height={"100%"}
      width={"100%"}
      border={`1px solid ${theme.palette.grey[400]}`}
      borderRadius={"5px"}
    >
      <Box
        position={"relative"}
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"10px"}
      >
        <Box display={"flex"} gap={"10px"}>
          <Typography fontWeight={"bold"} fontSize={"1.5rem"}>
            EXPENSES
          </Typography>
          {Boolean(Object.keys(expenseUpdates).length) && (
            <Tooltip title="save">
              <Chip
                label={`${Object.keys(expenseUpdates).length} Edited`}
                variant={"filled"}
                color="success"
                onClick={updateExpenses}
              />
            </Tooltip>
          )}
          {Boolean(failed.length) && (
            <Chip
              label={`${failed.length} failed`}
              variant={"outlined"}
              color="error"
              onClick={() => setStage(2)}
            />
          )}
        </Box>
        <Button variant="contained" disableElevation onClick={onExport}>
          Export
        </Button>
      </Box>
      <StatsBar stats={stats.all} />
      {Object.keys(expenses).length > 1 && (
        <>
          <Box paddingTop={"5px"}>
            <Box
              height={"100%"}
              width={"100%"}
              sx={{
                overflowX: "scroll",
                "&::-webkit-scrollbar": {
                  bgcolor: "transparent",
                  height: "5px",
                },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: theme.palette.grey[300],
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  cursor: "pointer",
                  bgcolor: theme.palette.grey[400],
                },
              }}
            >
              <Box display={"flex"} gap={"10px"} padding={"5px 10px"}>
                {Object.keys(expenses).map((year) => (
                  <Chip
                    size="large"
                    label={year}
                    variant={selectedYear === year ? "filled" : "outlined"}
                    color="primary"
                    onClick={() => handleSelectYear(year)}
                  />
                ))}
              </Box>
            </Box>
          </Box>
          <StatsBar context={selectedYear} stats={stats[selectedYear]} />
        </>
      )}
      {Object.keys(expenses[selectedYear]).length > 1 && (
        <>
          <Box paddingTop={"5px"}>
            <Box
              height={"100%"}
              width={"100%"}
              sx={{
                overflowY: "",
                overflowX: "scroll",
                "&::-webkit-scrollbar": {
                  bgcolor: "transparent",
                  height: "5px",
                },
                "&::-webkit-scrollbar-thumb": {
                  bgcolor: theme.palette.grey[300],
                },
                "&::-webkit-scrollbar-thumb:hover": {
                  cursor: "pointer",
                  bgcolor: theme.palette.grey[400],
                },
              }}
            >
              <Box display={"flex"} gap={"10px"} padding={"5px 10px"}>
                {Object.keys(expenses[selectedYear]).map((month) => (
                  <Chip
                    size="large"
                    label={month}
                    variant={selectedMonth === month ? "filled" : "outlined"}
                    color="primary"
                    onClick={() => handleSelectMonth(month)}
                  />
                ))}
              </Box>
            </Box>
          </Box>
          <StatsBar
            context={selectedMonth}
            stats={stats[selectedYear][selectedMonth]}
          />
        </>
      )}
      <Box display={"flex"} mr={"10px"}>
        <Cell isBold value={"Expense"} />
        <Cell isGrey isBold value="Receipient" />
        <Box width={"1px"} bgcolor={theme.palette.grey[400]} />
        <Cell isBold value="Amount" />
        <Cell isGrey isBold value="Date" />
        <Cell isBold value="Ref" />
      </Box>
      <Box
        position={"relative"}
        height={"100%"}
        sx={{
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            bgcolor: "transparent",
            width: "10px",
          },
          "&::-webkit-scrollbar-thumb": {
            borderRadius: "25px",
            bgcolor: theme.palette.grey[300],
          },
          "&::-webkit-scrollbar-thumb:hover": {
            cursor: "pointer",
            bgcolor: theme.palette.grey[400],
          },
        }}
      >
        {expenses[selectedYear][selectedMonth].map((expense, index) => (
          <ExpenseComponent
            {...{ index, expense, setExpenseUpdates, suggestions }}
          />
        ))}
      </Box>
    </Box>
  );
};

export default ExpensesTable;
