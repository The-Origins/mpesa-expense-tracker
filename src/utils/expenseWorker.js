import * as XLSX from "xlsx";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

class ExpenseWorker {
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
        : Number(amountMatch[1].replace(/,/g, ""))
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

  fetchExpenses(
    receipts,
    dictionary,
    statistics = { all: { total: 0, entries: 0, expenses: {} } },
    expenses = [],
    failed = []
  ) {
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
        !receipt.includes("was not successful") &&
        !receipt.includes("Your account balance was")
      ) {
        let info = this.retriveInfo(receipt);

        if (info) {
          if (info.amount === null || isNaN(info.amount)) {
            failed.push({ receipt, info });
            continue;
          }
          if (info.date === "Invalid Date" || info.date === null) {
            failed.push({ receipt, info });
            continue;
          }
          if (info.receipient === null) {
            failed.push({ receipt, info });
            continue;
          }

          info.expense = ["Unknown"];
          if (dictionary) {
            if (dictionary.expenses[info.receipient]) {
              info.expense = dictionary.expenses[info.receipient];
            } else {
              dictionary.keywords.forEach((keyword) => {
                if (info.receipient.toLowerCase().includes(keyword)) {
                  info.expense = dictionary.expenses[keyword];
                }
              });
            }
          }

          const expense = this.addExpense(statistics, expenses, info);
          statistics = expense.statistics;
          expenses = expense.expenses;
        }
      }
    }

    return { statistics, expenses, failed };
  }

  addExpense(statistics, expenses, expense) {
    const expenseDate = dayjs(expense.date);
    let weekStart = dayjs(expense.date).set(
      "date",
      expenseDate.date() - expenseDate.day()
    );
    let weekEnd = dayjs(expense.date).set("date", weekStart.date() + 6);
    const expenseWeek = `${weekStart.format("YYYY-MM-DD")}/${weekEnd.format(
      "YYYY-MM-DD"
    )}`;
    const expenseDay = expenseDate.format("YYYY-MM-DD");
    const expenseMonth = expenseDate.month();
    const expenseYear = expenseDate.year();

    statistics.all.total += Number(expense.amount);
    statistics.all.entries += 1;
    statistics.all.expenses = statistics.all.expenses || {};
    this.addExpenseToStatistics(statistics.all, expense);

    statistics[expenseYear] = statistics[expenseYear] || {
      total: 0,
      entries: 0,
      expenses: {},
    };
    statistics[expenseYear].total += Number(expense.amount);
    statistics[expenseYear].entries += 1;

    this.addExpenseToStatistics(statistics[expenseYear], expense);

    statistics[expenseYear][expenseMonth] = statistics[expenseYear][
      expenseMonth
    ] || {
      total: 0,
      entries: 0,
      expenses: {},
    };
    statistics[expenseYear][expenseMonth].total += Number(expense.amount);
    statistics[expenseYear][expenseMonth].entries += 1;

    this.addExpenseToStatistics(statistics[expenseYear][expenseMonth], expense);

    statistics[expenseYear][expenseMonth][expenseWeek] = statistics[
      expenseYear
    ][expenseMonth][expenseWeek] || { total: 0, entries: 0, expenses: {} };
    statistics[expenseYear][expenseMonth][expenseWeek].total += Number(
      expense.amount
    );
    statistics[expenseYear][expenseMonth][expenseWeek].entries += 1;

    this.addExpenseToStatistics(
      statistics[expenseYear][expenseMonth][expenseWeek],
      expense
    );

    statistics[expenseYear][expenseMonth][expenseWeek][expenseDay] = statistics[
      expenseYear
    ][expenseMonth][expenseWeek][expenseDay] || {
      total: 0,
      entries: 0,
      expenses: {},
    };
    statistics[expenseYear][expenseMonth][expenseWeek][expenseDay].total +=
      Number(expense.amount);
    statistics[expenseYear][expenseMonth][expenseWeek][expenseDay].entries += 1;

    this.addExpenseToStatistics(
      statistics[expenseYear][expenseMonth][expenseWeek][expenseDay],
      expense
    );

    expenses.push(expense);

    //sort expenses by date
    expenses.sort((a, b) => new Date(b.date) - new Date(a.date));

    console.log({
      statistics,
      expenses,
    });

    return {
      statistics,
      expenses,
    };
  }

  addExpenseToStatistics(statistics, info) {
    let current = statistics.expenses || {};

    // Loop through the expense array to nest each item
    for (let i = 0; i < info.expense.length; i++) {
      const expense = info.expense[i];
      // Initialize the current level if it doesn't exist
      current[expense] = current[expense] || {
        total: 0,
        entries: 0,
        expenses: {},
      };

      // Update the total and entries for the current expense level
      current[expense].total += Number(info.amount);
      current[expense].entries += 1;

      // Move to the next nested level (expenses)
      current = current[expense].expenses;
    }
  }

  async export(expenses) {
    return new Promise((resolve, reject) => {
      try {
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(expenses);
        XLSX.utils.book_append_sheet(workbook, worksheet, `expenses`);
        resolve(
          XLSX.writeFile(workbook, "expenses.xlsx", { bookType: "xlsx" })
        );
      } catch (error) {
        reject(error);
      }
    });
  }
}

export default ExpenseWorker;
