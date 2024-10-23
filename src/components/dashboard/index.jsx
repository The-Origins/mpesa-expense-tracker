import { Add, Error, TrendingDown, TrendingUp } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import ScopeSelect from "./scopeSelect";
import { BarChart } from "@mui/x-charts";
import { useDispatch, useSelector } from "react-redux";
import DashboardExpense from "./expense";
import CustomPieChart from "../pieChart";
import AppWorker from "../../utils/appWorker";
import ExpenseModal from "../modals/expense";
import ExpenseWorker from "../../utils/expenseWorker";
import { setStatistics } from "../../state/statistics";
import { setExpenses } from "../../state/expenses";

const Dashboard = () => {
  const dispatch = useDispatch();
  const theme = useTheme();
  const expenses = useSelector((state) => state.expenses);
  const statistics = useSelector((state) => state.statistics);
  const [scope, setScope] = useState("all time");
  const [data, setData] = useState(null);
  const [isExpenseModal, setIsExpenseModal] = useState(false);

  const addExpense = (expense) => {
    const expenseWorker = new ExpenseWorker();
    const mutableStatistics = JSON.parse(JSON.stringify(statistics));
    const mutableExpenses = [...expenses];
    const data = expenseWorker.addExpense(
      mutableStatistics,
      mutableExpenses,
      expense
    );
    dispatch(setStatistics(data.statistics));
    dispatch(setExpenses(data.expenses));
  };

  useEffect(() => {
    if (Object.keys(statistics).length) {
      const appWorker = new AppWorker();
      appWorker.getDashboardData(statistics).then((res) => {
        setData(res);
        setScope(Object.keys(res)[Object.keys(res).length - 1]);
      });
    }
  }, [statistics]);

  return (
    <Box width={"100%"} display={"flex"}>
      <ExpenseModal
        open={isExpenseModal}
        handleClose={() => setIsExpenseModal(false)}
        onComplete={addExpense}
      />
      <Box
        width={"100%"}
        padding={"20px"}
        display={"flex"}
        flexDirection={"column"}
        gap={"20px"}
      >
        <Box
          boxShadow={`0px 0px 10px 0px ${theme.palette.grey[400]}`}
          width={"100%"}
          padding={"20px"}
          display={"flex"}
          justifyContent={"space-between"}
          borderRadius={"10px"}
          height={"25vh"}
        >
          {data ? (
            <>
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-evenly"}
                gap={"20px"}
              >
                <Typography
                  variant="h1"
                  fontWeight={"bold"}
                  fontSize={"1.7rem"}
                >
                  -Ksh{" "}
                  {Number(data[scope].total).toLocaleString(undefined, {
                    maximumFractionDigits: 2,
                  })}
                </Typography>
                <Box display={"flex"} gap={"5px"} alignItems={"center"}>
                  <Typography>
                    {scope.charAt(0).toUpperCase() + scope.substring(1)}
                  </Typography>
                  {data[scope].stat ? (
                    <Box display={"flex"} alignItems={"center"} gap={"5px"}>
                      <Typography
                        display={"flex"}
                        color={
                          data[scope].stat.percent <= 0 ? "success" : "error"
                        }
                      >
                        {data[scope].stat.percent <= 0 ? (
                          <TrendingDown />
                        ) : (
                          <TrendingUp />
                        )}
                        {String(data[scope].stat.percent).replace("-", "")}%
                      </Typography>
                      <Typography>From {data[scope].stat.title}</Typography>
                    </Box>
                  ) : (
                    <Typography>expenses</Typography>
                  )}
                </Box>
              </Box>
              <Box
                display={"flex"}
                flexDirection={"column"}
                justifyContent={"space-evenly"}
                alignItems={"flex-end"}
                gap={"20px"}
              >
                <Typography
                  color="error"
                  display={"flex"}
                  alignItems={"center"}
                  gap={"5px"}
                >
                  <Error sx={{ fontSize: "1rem" }} />
                  Over budget
                </Typography>
                <Button
                  disableElevation
                  variant="contained"
                  startIcon={<Add />}
                  onClick={() => setIsExpenseModal(true)}
                >
                  add expense
                </Button>
              </Box>
            </>
          ) : (
            <Typography
              height={"100%"}
              width={"100%"}
              display={"flex"}
              flexDirection={"column"}
              gap={"10px"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              No data
              <Button
                variant="contained"
                disableElevation
                onClick={() => setIsExpenseModal(true)}
              >
                Add expense
              </Button>
            </Typography>
          )}
        </Box>
        <Box
          width={"100%"}
          display={"flex"}
          gap={"20px"}
          flexDirection={"row-reverse"}
        >
          {data &&
            Object.keys(data).map((dataScope, index) => (
              <ScopeSelect
                key={index}
                currentScope={scope}
                scope={dataScope}
                setScope={setScope}
              />
            ))}
        </Box>
        <Box display={"flex"} flexDirection={"column"} gap={"10px"}>
          <Typography ml={"20px"} fontSize={"1.3rem"} fontWeight={"bold"}>
            {scope === "today"
              ? "This week's"
              : scope === "all time"
              ? "All time"
              : scope.charAt(0).toUpperCase() + scope.substring(1) + "'s"}{" "}
            stats
          </Typography>
          {data ? (
            <BarChart
              series={[{ data: data[scope].line.data }]}
              xAxis={[{ scaleType: "band", data: data[scope].line.lables }]}
              width={790}
              height={400}
            />
          ) : (
            <Typography
              height={"100%"}
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              No data
            </Typography>
          )}
        </Box>
      </Box>
      <Box
        display={"flex"}
        flexDirection={"column"}
        gap={"20px"}
        padding={"20px 20px 0px 0px"}
        width={"450px"}
      >
        {data ? (
          <CustomPieChart
            data={data[scope].pie}
            legend={{ position: "bottom", height: "100px" }}
          />
        ) : (
          <Typography
            height={"100%"}
            width={"100%"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            No data
          </Typography>
        )}
        <Box
          display={"flex"}
          flexDirection={"column"}
          gap={"20px"}
          height={"80%"}
        >
          <Typography fontSize={"1.3rem"} fontWeight={"bold"}>
            Recent expenses
          </Typography>
          {expenses.length ? (
            expenses.map((expense, index) => {
              if (index <= 2) {
                return <DashboardExpense key={expense.id} expense={expense} />;
              }
              return null;
            })
          ) : (
            <Typography
              height={"100%"}
              width={"100%"}
              display={"flex"}
              justifyContent={"center"}
              alignItems={"center"}
            >
              No data
            </Typography>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Dashboard;
