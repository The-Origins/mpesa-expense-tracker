const db = require("../../../config/db");

module.exports = async (receipts, user) => {
  const expenses = [];
  const failed = [];

  for (let receipt of receipts) {
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
      failed.push(info);
      continue;
    }

    const labels = await fetchLabels(info.recipient, user);
    expenses.push({ ...info, labels });
  }

  return { expenses, failed };
};

fetchLabels = async (recipient, user) => {
  const dictionaryRef = db
    .collection("users")
    .doc(user.id)
    .collection("dictionary")
    .doc(recipient);

  const dictionaryData = await dictionaryRef.get();

  //check if recipient exists in dictionary
  if (dictionaryData.exists) {
    return dictionaryData.data().labels;
  }

  //return unkown
  return ["unkown"];
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

  let recipient = withdrawalMatch
    ? withdrawalMatch[1].trim()
    : receipt.match(airtimeRegex)
    ? "safaricom"
    : receipt.match(recipientRegex)
    ? receipt.match(recipientRegex)[0].replace(/^to\s+/i, "")
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
        ? String(Number(hour) + 12)
        : hour === "12"
        ? `00`
        : ("0" + hour).slice(-2);
    time = `${hour}:${minute}`;
  }

  if (date) {
    const [day, month, year] = date.split("/");
    date = `20${year}-${("0" + month).slice(-2)}-${day}`;
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
