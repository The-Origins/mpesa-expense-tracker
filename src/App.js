import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  IconButton,
  Typography,
  useTheme,
} from "@mui/material";
import {
  BarChartRounded,
  EditNoteRounded,
  HomeRounded,
  LogoutRounded,
  Menu,
  PaidRounded,
  SettingsRounded,
} from "@mui/icons-material";
import SideBarElement from "./components/sidebar/sideBarElement";
import SideBarLink from "./components/sidebar/sideBarLink";
import { Route, Routes } from "react-router-dom";
import Dashboard from "./components/dashboard";
import { useDispatch, useSelector } from "react-redux";
import ExpenseWorker from "./utils/expenseWorker";
import receipts from "./lib/receipts";
import { setExpenses } from "./state/expenses";
import { setStatistics } from "./state/statistics";
import { setFailed } from "./state/failed";
import Expenses from "./components/expenses";
import ParseReceipts from "./components/expenses/receipts";
import { resetDictionary } from "./state/dictionary";

const App = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const [open, setOpen] = useState(true);
  const dictionary = useSelector((state) => state.dictionary);

  const loadSamples = () => {
    const expenseWorker = new ExpenseWorker();
    const samples = expenseWorker.fetchExpenses(receipts, dictionary);
    dispatch(setExpenses(samples.expenses));
    dispatch(setStatistics(samples.statistics));
    dispatch(setFailed(samples.failed));
    dispatch(resetDictionary());
  };

  return (
    <Box minHeight={"100vh"} display={"flex"}>
      <Box
        height={"100vh"}
        width={open ? "250px" : "80px"}
        display={"flex"}
        flexDirection={"column"}
        justifyContent={"space-between"}
        padding={"40px 0px"}
        borderRadius={"10px"}
        boxShadow={`0px 0px 10px 0px ${theme.palette.grey[400]}`}
        sx={{
          transition: "width 0.1s ease-in-out",
        }}
      >
        <SideBarElement
          open={open}
          icon={
            <IconButton onClick={() => setOpen((prev) => !prev)}>
              <Menu />
            </IconButton>
          }
          title={
            <Box display={"flex"} gap={"10px"} pr={"15px"}>
              <Typography
                variant="h1"
                fontWeight={"bold"}
                fontSize={"clamp(1rem, 10vw, 1.4rem)"}
              >
                Expense
              </Typography>
              <Typography
                variant="h1"
                fontWeight={"bold"}
                fontSize={"clamp(1rem, 10vw, 1.4rem)"}
              >
                Tracker
              </Typography>
            </Box>
          }
        />
        <SideBarElement
          open={open}
          flexDirection="column"
          icon={<Avatar />}
          title={
            <Box
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
            >
              <Typography>Welcome back,</Typography>
              <Typography
                variant="h1"
                fontWeight={"bold"}
                fontSize={"clamp(1rem, 10vw, 1.5rem)"}
              >
                John Doe
              </Typography>
            </Box>
          }
        />
        <Button onClick={loadSamples}>Load samples</Button>
        <Box>
          <SideBarLink path={"dashboard"} open={open} icon={<HomeRounded />} />
          <SideBarLink
            path={"statistics"}
            open={open}
            icon={<BarChartRounded />}
          />
          <SideBarLink path={"expenses"} open={open} icon={<PaidRounded />} />
          <SideBarLink path={"budget"} open={open} icon={<EditNoteRounded />} />
          <SideBarLink
            path={"settings"}
            open={open}
            icon={<SettingsRounded />}
          />
        </Box>
        <Box display={"flex"} justifyContent={"center"}>
          {open ? (
            <Button variant="outlined" startIcon={<LogoutRounded />}>
              logout
            </Button>
          ) : (
            <IconButton color="primary">
              <LogoutRounded />
            </IconButton>
          )}
        </Box>
      </Box>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/expenses/receipts/*" element={<ParseReceipts />} />
      </Routes>
    </Box>
  );
};

export default App;
