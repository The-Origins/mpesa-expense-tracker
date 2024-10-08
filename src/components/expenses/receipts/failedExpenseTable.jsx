import { ChevronRight, ReceiptLong } from "@mui/icons-material";
import { Box, Button, Typography, useTheme } from "@mui/material";
import React from "react";
import FailedExpense from "./failedExpense";

const FailedExpenseTable = ({
  receiptFailed,
  receiptStatistics,
  receiptExpenses,
  setReceiptExpenses,
  setReceiptStatistics,
  setReceiptFailed,
  setStage,
}) => {
  const theme = useTheme();

  const handleData = (data) => {
    setReceiptExpenses(data.expenses);
    setReceiptStatistics(data.statistics);
    setReceiptFailed(data.failed);
  };

  return (
    <Box
      height={"100%"}
      width={"100%"}
      display={"flex"}
      flexDirection={"column"}
      border={`1px solid ${theme.palette.grey[400]}`}
    >
      <Box
        display={"flex"}
        justifyContent={"space-between"}
        alignItems={"center"}
        padding={"10px"}
        borderBottom={`1px solid ${theme.palette.grey[400]}`}
        position={"relative"}
      >
        <Button onClick={() => setStage(0)} variant="outlined">
          Retry
        </Button>
        <Box
          position={"absolute"}
          left={"50%"}
          height={"50%"}
          display={"flex"}
          flexDirection={"column"}
          alignItems={"center"}
          sx={{
            transform: "translateX(-50%) translateY(-50%)",
          }}
        >
          <Typography fontWeight={"bold"} fontSize={"1.5rem"}>
            Failed Expenses
          </Typography>
          <Typography fontSize={"0.9rem"} color={theme.palette.grey[500]}>
            We were unable to process the following receipts
          </Typography>
        </Box>
        <Button
          disableElevation
          variant="contained"
          onClick={() => setStage(1)}
          endIcon={<ChevronRight />}
          disabled={!Object.keys(receiptExpenses || {}).length}
        >
          Go to expenses
        </Button>
      </Box>
      <Box
        height={"100%"}
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
        <Box
          display={"flex"}
          flexDirection={"column"}
          padding={"20px"}
          gap={"20px"}
        >
          {receiptFailed.length ? (
            receiptFailed.map((expense, index) => (
              <FailedExpense
                {...{
                  expense,
                  index,
                  receiptFailed,
                  receiptStatistics,
                  receiptExpenses,
                  handleData,
                }}
              />
            ))
          ) : (
            <Box
              height={"100%"}
              display={"flex"}
              flexDirection={"column"}
              alignItems={"center"}
              justifyContent={"center"}
              gap={"10px"}
            >
              <ReceiptLong color="disabled" />
              <Typography>No remaing receipts</Typography>
              <Button
                disableElevation
                variant="contained"
                onClick={() => setStage(1)}
                size="small"
              >
                View Expenses
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default FailedExpenseTable;
