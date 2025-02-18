const db = require("../../../config/db");
const client = require("../../../config/redis");
const setDefaultLabels = require("./setDefaultLabels");

module.exports = async (receipts, failed, user) => {
  const expenses = [];

  for (let i = 0; i < receipts.length; i++) {
    const receipt = receipts[i];
    const info = retriveInfo(receipt);

    if (
      info.amount === null ||
      isNaN(info.amount) ||
      info.date === null ||
      info.recipient === null ||
      !info.recipient.length ||
      info.ref === null ||
      !info.ref.length
    ) {
      let errors = {};
      if (info.amount === null || isNaN(info.amount)) {
        errors["amount"] = "Unable to retrieve amount";
      }
      if (info.date === null) {
        errors["date"] = "Unable to retrieve date";
      }
      if (info.recipient === null || !info.recipient.length) {
        errors["recipient"] = "Unable to retrieve recipient";
      }
      if (info.ref === null || !info.ref.length) {
        errors[ref] = "Unable to retrieve reference ID";
      }
      failed[i] = { ...info, receipt, errors };
      failed.length += 1;
      continue;
    }

    await fetchLabels(info, user);
    expenses.push({ ...info, receipt });
  }

  return expenses;
};

fetchLabels = async (expense, user) => {
  const dictionaryRef = db
    .collection("users")
    .doc(user.id)
    .collection("dictionary")
    .doc(expense.recipient);

  const keywordsRef = db
    .collection("users")
    .doc(user.id)
    .collection("keywords");

  const dictionaryInfo = await dictionaryRef.get();

  //check if recipient exists in dictionary
  if (dictionaryInfo.exists) {
    const data = dictionaryInfo.data();
    expense.labels = data.labels;
    if (data.keyword) {
      expense.keyword = data.keyword;
    }
  } else {
    const cachedKeywords = await client.get(`keywords:${user.id}:`);

    if (cachedKeywords) {
      for (let item of JSON.parse(cachedKeywords)) {
        if (expense.recipient.includes(item.keyword)) {
          expense.labels = item.labels;
          expense.keyword = item.keyword;
          break;
        }
      }
    } else {
      const keywords = (await keywordsRef.listDocuments()).map((doc) => doc.id);

      for (let keyword of keywords) {
        if (expense.recipient.includes(keyword)) {
          const data = (await keywordsRef.doc(keyword).get()).data();
          expense.labels = data.labels;
          expense.keyword = keyword;
          break;
        }
      }
    }

    if (!expense.labels) {
      setDefaultLabels(expense);
    }
  }
};

const retriveInfo = (receipt) => {
  const refRegex = /^[A-Z0-9]+/;

  const recipientRegex = /to\s+([A-Z0-9\s'/-]+?)(?=\s+on|\.)/gi;
  const withdrawalRegex = /from (.+?) New/i;
  const airtimeRegex = /You bought Ksh\d{1,3}(,\d{3})*(\.\d{2})? of airtime/i;

  const amountRegex = /Ksh(\d{1,3}(,\d{3})*(\.\d{2})?)/;
  const transactionCostRegex =
    /Transaction cost, Ksh(\d{1,3}(,\d{3})*(\.\d{2})?)/i;

  const dateRegex = /on (\d{1,2}\/\d{1,2}\/\d{2,4})/;
  const timeRegex = /at (\d{1,2}:\d{2} (?:AM|PM))/;

  const ref = receipt.match(refRegex) ? receipt.match(refRegex)[0] : null;

  const amountMatch = receipt.match(amountRegex)
    ? receipt.match(amountRegex)
    : null;

  const transactionCostMatch = receipt.match(transactionCostRegex);

  let amount = amountMatch
    ? transactionCostMatch
      ? Number(amountMatch[1].replace(/,/g, "")) +
        Number(transactionCostMatch[1].replace(/,/g, ""))
      : Number(amountMatch[1].replace(/,/g, ""))
    : null;

  const withdrawalMatch = receipt.match(withdrawalRegex);

  const recipientMatch = receipt.match(recipientRegex);

  let recipient = withdrawalMatch
    ? withdrawalMatch[1].trim().toLowerCase()
    : receipt.match(airtimeRegex)
    ? "safaricom"
    : recipientMatch
    ? recipientMatch[0].replace(/^to\s+/i, "").toLowerCase()
    : null;

  let date = receipt.match(dateRegex)
    ? receipt.match(dateRegex)[1].trim()
    : null;
  let time = receipt.match(timeRegex)
    ? receipt.match(timeRegex)[1].trim()
    : null;

  if (time) {
    let [hour, rest] = time.split(":");
    const [minute, ampm] = rest.split(" ");

    hour =
      ampm.toLowerCase() === "pm"
        ? hour === "12"
          ? "12"
          : String(Number(hour) + 12)
        : hour === "12"
        ? `00`
        : ("0" + hour).slice(-2);
    time = `${hour}:${minute}`;
  }

  if (date) {
    const [day, month, year] = date.split("/");
    date = `${("20" + year).slice(-4)}-${("0" + month).slice(-2)}-${(
      "0" + day
    ).slice(-2)}`;
  }

  let dateTime = null;

  if (date && time) {
    const newDate = new Date(`${date}T${time}`);
    if (newDate instanceof Date && !isNaN(newDate)) {
      dateTime = newDate.toISOString();
    }
  }

  return {
    ref,
    amount,
    recipient,
    date: dateTime,
  };
};
