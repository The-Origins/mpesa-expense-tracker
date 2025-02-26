module.exports = (expense) => {
  const recipient = expense.recipient;
  let accountIndex = recipient.indexOf("for account");

  if (accountIndex !== -1) {
    accountIndex += 12;
    expense.labels = [recipient.substring(accountIndex)];
  } else {
    expense.labels = recipient.trim().split(" ").slice(0, 1);
  }
  expense.isUnknown = true;
};
