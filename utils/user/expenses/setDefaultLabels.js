module.exports = (expense) => {
  const recipient = expense.recipient;
  const accountMatch = recipient.match(/for account/i);
  const accountMatchIndex = !accountMatch || accountMatch.index + 11;

  expense.labels = accountMatch
    ? [
        recipient
          .substring(
            accountMatchIndex,
            recipient.indexOf(" ", accountMatchIndex)
          )
          .toLowerCase(),
      ]
    : [recipient.split(" ")[0].toLowerCase()];
  expense.isUnknown = true;
};
