import {
  Box,
  Button,
  Checkbox,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
  Tabs,
  TextField,
  Tooltip,
  Typography,
  useTheme,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import ExpenseComponent from "./expenseComponent.jsx";
import {
  Add,
  Cancel,
  Delete,
  IosShare,
  MoneyOff,
  Search,
} from "@mui/icons-material";
import ExpenseWorker from "../../utils/expenseWorker.js";
import ExpenseModal from "../modals/expense.jsx";
import ExportModal from "./exportModal.jsx";
import DeleteModal from "./deleteModal.jsx";
import FailedExpenseComponent from "./failedExpenseComponent.jsx";

const headerCells = [
  {
    id: "receipient",
    label: "Receipient",
  },
  {
    id: "amount",
    label: "Amount",
  },
  {
    id: "date",
    label: "Date",
  },
  {
    id: "ref",
    label: "Ref",
  },
];

const ExpensesTable = ({
  setStage,
  setStatus,
  failed,
  setFailed,
  expenses,
  setExpenses,
  statistics,
  setStatistics,
}) => {
  const expenseWorker = new ExpenseWorker();
  const theme = useTheme();
  const [tab, setTab] = useState(0);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [expenseModalInfo, setExpenseModalInfo] = useState({
    open: false,
    type: "add",
  });
  const [isExportModal, setIsExportModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState({ open: false });
  const [search, setSearch] = useState("");
  const [expandSearch, setExpandSearch] = useState(false);
  const [results, setResults] = useState([]);
  const [sort, setSort] = useState({ key: "date", order: "desc" });
  const [selected, setSelected] = useState({ total: 0 });

  useEffect(() => {
    const expenseWorker = new ExpenseWorker();
    setResults(
      expenseWorker.fetchResults(
        search.trim(),
        expenses,
        sort,
        page,
        rowsPerPage
      )
    );
  }, [search, expenses, sort, page, rowsPerPage, expenses.length]);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleSearchChange = ({ target }) => {
    setSearch(target.value);
    setPage(0);
  };

  const handleTabChange = (event, newTab) => {
    setTab(newTab);
  };

  const handleSortChange = (key) => {
    setSort((prev) => ({
      key,
      order: prev.key === key ? (prev.order === "asc" ? "desc" : "asc") : "asc",
    }));
  };

  const handleSelectAll = ({ target }) => {
    if (target.checked) {
      setSelected((prev) => ({
        ...prev,
        [page]: results.map((expense) => expense.id),
        total: prev.total + results.length - (prev[page]?.length || 0),
      }));
    } else {
      setSelected((prev) => {
        const { [page]: value, ...rest } = prev;
        return { ...rest, total: prev.total - results.length };
      });
    }
  };

  const handleNoResults = () => {
    if (tab === 0) {
      if (search.length) {
        setSearch("");
      } else {
        setExpenseModalInfo({
          open: true,
          type: "add",
          onComplete: addExpense,
        });
      }
    } else if (tab === 1) {
      setTab(0);
    }
  };

  const handleAllExport = (value) => {
    if (value === "current") {
      handleExport(results);
    }
    if (value === "all") {
      handleExport(expenses);
    }
  };

  const selectedExpenses = () => {
    const { total, ...pages } = selected;
    const ids = Object.values(pages).flat();
    return expenses.filter((expense) => ids.includes(expense.id));
  };

  const handleSelectedExport = () => {
    handleExport(selectedExpenses());
    setSelected({ total: 0 });
  };

  const handleSelectedDelete = () => {
    let newData = { statistics, expenses };
    selectedExpenses().forEach((expense) => {
      newData = expenseWorker.deleteExpense(
        newData.statistics,
        newData.expenses,
        expense
      );
    });
    setExpenses(newData.expenses);
    setStatistics(newData.statistics);
    setSelected({ total: 0 });
  };

  const addExpense = (expense) => {
    const newData = expenseWorker.addExpense(statistics, expenses, expense);
    setExpenses(newData.expenses);
    setStatistics(newData.statistics);
    setPage(0);
  };

  const handleExport = (expenses) => {
    expenseWorker.export(expenses);
  };
  return (
    <Paper
      elevation={2}
      sx={{
        display: "flex",
        flexDirection: "column",
        width: "100%",
        height: "100%",
      }}
    >
      <ExpenseModal
        {...expenseModalInfo}
        handleClose={() => setExpenseModalInfo({ open: false, type: "add" })}
      />
      <ExportModal
        results={results}
        expenses={expenses}
        open={isExportModal}
        handleClose={() => setIsExportModal(false)}
        onConfirm={handleAllExport}
      />
      <DeleteModal
        {...deleteModal}
        handleClose={() => setDeleteModal({ open: false })}
      />
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          padding: "10px 20px",
        }}
      >
        <Typography fontWeight={"bold"} variant="h1" fontSize={"1.6rem"}>
          {["Expenses", "Failed Expenses"][tab]}
        </Typography>
        <Tabs value={tab} onChange={handleTabChange}>
          <Tab id={0} label={`All (${expenses.length})`} />
          <Tab
            disabled={!failed.length}
            id={1}
            label={`Failed (${failed.length})`}
          />
        </Tabs>
      </Box>
      <Divider />
      {
        [
          <>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-end",
                padding: "10px 20px",
              }}
            >
              <TextField
                size="small"
                type="search"
                placeholder="Search..."
                value={search}
                onChange={handleSearchChange}
                onFocus={() => setExpandSearch(true)}
                onBlur={() => {
                  if (!search.length) setExpandSearch(false);
                }}
                sx={{
                  borderRadius: "5px",
                  bgcolor: theme.palette.grey[300],
                  transition: "width 0.3s",
                  width: expandSearch ? "210px" : "150px",
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      border: "none", // Removes the border
                    },
                    "&:hover fieldset": {
                      border: "none", // Removes the border on hover
                    },
                    "&.Mui-focused fieldset": {
                      border: "none", // Removes the border when focused
                    },
                  },
                }}
                slotProps={{
                  input: {
                    autoComplete: "off",
                    startAdornment: (
                      <InputAdornment position="start">
                        <Search />
                      </InputAdornment>
                    ),
                  },
                }}
              />
              <Box display={"flex"} gap={"10px"}>
                <Tooltip title="Export">
                  <IconButton
                    disabled={!expenses.length}
                    color="primary"
                    onClick={() => setIsExportModal(true)}
                  >
                    <IosShare />
                  </IconButton>
                </Tooltip>
                <Button
                  disableElevation
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() =>
                    setExpenseModalInfo({
                      open: true,
                      type: "add",
                      onComplete: addExpense,
                    })
                  }
                >
                  Add expense
                </Button>
              </Box>
            </Box>
            <Divider />
            <TableContainer style={{ maxHeight: "100%" }}>
              <Table
                sx={{ width: "100%", height: "100%" }}
                stickyHeader
                aria-label="expense table"
              >
                <TableHead>
                  <TableRow>
                    <TableCell>
                      <Tooltip title="Select All">
                        <Checkbox
                          disabled={!results.length}
                          onClick={handleSelectAll}
                          checked={
                            results.length &&
                            selected[page] &&
                            selected[page].length === results.length
                          }
                        />
                      </Tooltip>
                    </TableCell>
                    <TableCell>
                      {Object.keys(selected).length > 1 ? (
                        <Box display={"flex"} gap={"5px"} alignItems={"center"}>
                          <Typography fontWeight={"bold"}>
                            {selected.total + " Selected"}
                          </Typography>
                          <Tooltip title="Clear Selected">
                            <IconButton
                              onClick={() => setSelected({ total: 0 })}
                              size="small"
                            >
                              <Cancel sx={{ fontSize: "1rem" }} />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      ) : (
                        <TableSortLabel
                          active={sort.key === "expense"}
                          direction={
                            sort.key === "expense" ? sort.order : "asc"
                          }
                          onClick={() => handleSortChange("expense")}
                        >
                          <Typography fontWeight={"bold"}>Expense</Typography>
                        </TableSortLabel>
                      )}
                    </TableCell>
                    {headerCells.map((cell) => (
                      <TableCell key={cell.id}>
                        {Object.keys(selected).length <= 1 && (
                          <TableSortLabel
                            active={sort.key === cell.id}
                            direction={
                              sort.key === cell.id ? sort.order : "asc"
                            }
                            onClick={() => handleSortChange(cell.id)}
                          >
                            <Typography fontWeight={"bold"}>
                              {cell.label}
                            </Typography>
                          </TableSortLabel>
                        )}
                      </TableCell>
                    ))}
                    <TableCell padding="none" colSpan={2}>
                      {Boolean(Object.keys(selected).length > 1) && (
                        <Box display={"flex"} gap={"10px"}>
                          <Tooltip title={"Export selected"}>
                            <IconButton
                              color="primary"
                              onClick={handleSelectedExport}
                            >
                              <IosShare />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title={"Delete Selected"}>
                            <IconButton
                              color="error"
                              onClick={() =>
                                setDeleteModal({
                                  open: true,
                                  message: `Are you sure you want to delete ${selected.total.toLocaleString()} expense${
                                    selected.total === 1 ? "" : "s"
                                  }?`,
                                  onConfirm: handleSelectedDelete,
                                })
                              }
                            >
                              <Delete />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      )}
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {results.map((expense, index) => (
                    <ExpenseComponent
                      {...{
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
                      }}
                    />
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </>,
          <TableContainer style={{ maxHeight: "100%" }}>
            <Table
              stickyHeader
              sx={{ width: "100%", height: "100%" }}
              aria-label="failed table"
            >
              <TableHead>
                <TableRow>
                  <TableCell></TableCell>
                  <TableCell key={"expense"}>
                    <Typography fontWeight={"bold"}>Expense</Typography>
                  </TableCell>
                  {headerCells.map((cell) => (
                    <TableCell key={cell.id}>
                      <Typography fontWeight={"bold"}>{cell.label}</Typography>
                    </TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {failed
                  .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                  .map((expense, index) => (
                    <FailedExpenseComponent
                      {...{
                        index,
                        expense,
                        setFailed,
                        addExpense,
                        setDeleteModal,
                        setExpenseModalInfo,
                      }}
                    />
                  ))}
              </TableBody>
            </Table>
          </TableContainer>,
        ][tab]
      }
      {(tab === 0 && !results.length) || (tab === 1 && !failed.length) ? (
        <Box
          width={"100%"}
          display={"flex"}
          alignItems={"center"}
          flexDirection={"column"}
          gap={"20px"}
          padding={"20px"}
        >
          <MoneyOff fontSize={"large"} />
          <Typography>
            {tab === 0
              ? search.length
                ? `No results found for '${search}'`
                : "No expenses found"
              : tab === 1 && "No remaining failed expenses"}
          </Typography>
          <Button
            variant="contained"
            disableElevation
            onClick={handleNoResults}
          >
            {tab === 0
              ? search.length
                ? "Clear search"
                : "Add new expense"
              : tab === 1 && "Go to expenses"}
          </Button>
        </Box>
      ) : (
        <></>
      )}
      <Box height={"60px"} width={"100%"}>
        <TablePagination
          rowsPerPageOptions={[5, 10, 20]}
          component="div"
          count={
            tab === 0
              ? search.length
                ? results.length
                : expenses.length
              : failed.length
          }
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </Box>
    </Paper>
  );
};

export default ExpensesTable;
