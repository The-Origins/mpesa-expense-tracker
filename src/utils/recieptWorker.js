import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

class RecieptWorker {
  retriveInfo(receipt) {
    dayjs.extend(customParseFormat);
    // Regular expressions for extracting each part
    const refNoRegex = /^[A-Z0-9]+/; // Reference number at the start
    const amountRegex = /Ksh(\d{1,3}(,\d{3})*(\.\d{2})?)/; // Amount in format KshX,XXX.XX
    const nameRegex = /to ([A-Z\s-]+|\S+\s+\S+)/i; // Name of the recipient
    const airtimeRegex = /You bought Ksh\d{1,3}(,\d{3})*(\.\d{2})? of airtime/i;
    const dateRegex = /on (\d{1,2}\/\d{1,2}\/\d{2,4})/; // Date after 'on'
    const timeRegex = /at (\d{1,2}:\d{2} (?:AM|PM))/; // Time in 12-hour format (AM/PM)
    const transactionCostRegex = /Transaction cost, Ksh(\d+(\.\d{2})?)/; // Transaction cost in format KshXXX.XX
    const withdrawRegex = /Withdraw Ksh(\d{1,3}(,\d{3})*(\.\d{2})?) from/i; // For withdrawals
    const accountRegex = /for account (\S+)/; // For transactions with accounts
    const fromToBalanceRegex = /from (.+?) New M-PESA balance/i;
    let name = null;

    // Extract values using regex
    const refNo = receipt.match(refNoRegex)
      ? receipt.match(refNoRegex)[0]
      : null;
    const amountMatch = receipt.match(amountRegex)
      ? receipt.match(amountRegex)
      : null;
    const transactionCostMatch = receipt.match(transactionCostRegex)
      ? receipt.match(transactionCostRegex)
      : null;
    const amount = amountMatch
      ? transactionCostMatch
        ? Number(transactionCostMatch[1].replace(/,/g, "")) +
          Number(amountMatch[1].replace(/,/g, ""))
        : amountMatch[1]
      : null;

    const fromMatch = receipt.match(fromToBalanceRegex);
    name = fromMatch
      ? fromMatch[1].trim()
      : receipt.match(airtimeRegex)
      ? "airtime"
      : receipt.match(nameRegex)
      ? String(receipt.match(nameRegex)[1].trim()).replace(" on", "")
      : null;

    const account = receipt.match(accountRegex)
      ? receipt.match(accountRegex)[1]
      : null;
    if (account) {
      name = name + " " + account;
    }
    const date = receipt.match(dateRegex)
      ? receipt.match(dateRegex)[1].trim()
      : null;
    const time = receipt.match(timeRegex)
      ? receipt.match(timeRegex)[1].trim()
      : null;
    const withdrawAmountMatch = receipt.match(withdrawRegex)
      ? receipt.match(withdrawRegex)
      : null;
    const withdrawAmount = withdrawAmountMatch
      ? `${withdrawAmountMatch[1]}`
      : null;

    const dateTime =
      date &&
      time &&
      dayjs(
        `${date} ${time}`,
        `D/M/YY${date.length === 10 ? "YY" : ""} h:mm A`
      ).toISOString();

    // Return an object with the extracted values
    return {
      ref: refNo,
      amount: amount || withdrawAmount,
      receipient: name,
      date: dateTime,
    };
  }

  fetchExpenses(receipts) {
    let expenses = {};
    let failed = [];
    let stats = { all: { total: 0, entries: 0 } };
    // Ensure that newlines and special spaces are handled
    const recieptIdRegex =
      /\b(?=[A-Z]{2})(?=(?:[^0-9]*[0-9]){1})[A-Z0-9]{10}(?=\s|\.)/g;

    const matches = (receipts.match(recieptIdRegex) || []).filter((id) =>
      /\d/.test(id)
    );

    for (let i = 0; i < matches.length; i++) {
      // Find the start position of the current ID
      const startPos = receipts.indexOf(matches[i]);

      // Find the start position of the next ID (or the end of the string if it's the last one)
      const endPos =
        i < matches.length - 1
          ? receipts.indexOf(matches[i + 1])
          : receipts.length;

      // Extract the substring between the current ID and the next ID
      const receipt = receipts.substring(startPos, endPos).trim();

      if (
        !receipt.includes("received") &&
        !receipt.includes("was not successful")
      ) {
        let info = this.retriveInfo(receipt);
        if (info) {
          if (info.amount === null) {
            failed.push({ receipt, info });
            continue;
          }
          if (info.date === "Invalid Date") {
            failed.push({ receipt, info });
            continue;
          }
          if (info.receipient === null) {
            failed.push({ receipt, info });
            continue;
          }

          info.expense = "Unknown";

          const expense = this.addExpense(stats, expenses, info);
          stats = expense.stats;
          expenses = expense.expenses;
        }
      }
    }
    return { stats, expenses, failed };
  }

  addExpense(stats, expenses, expense) {
    const expenseDate = dayjs(expense.date);
    const expenseMonth = expenseDate.format("MMMM");
    const expenseYear = expenseDate.format("YYYY");

    stats.all.total += Number(expense.amount);
    stats.all.entries += 1;
    stats[expenseYear] = stats[expenseYear] || { total: 0, entries: 0 };
    stats[expenseYear].total += Number(expense.amount);
    stats[expenseYear].entries += 1;
    stats[expenseYear][expenseMonth] = stats[expenseYear][expenseMonth] || {
      total: 0,
      entries: 0,
    };
    stats[expenseYear][expenseMonth].total += Number(expense.amount);
    stats[expenseYear][expenseMonth].entries += 1;

    expenses[expenseYear] = expenses[expenseYear] || {};

    expenses[expenseYear][expenseMonth] =
      expenses[expenseYear][expenseMonth] || [];

    expenses[expenseYear][expenseMonth] = [
      ...expenses[expenseYear][expenseMonth],
      expense,
    ];

    return {
      stats,
      expenses,
    };
  }
}

export default RecieptWorker;
