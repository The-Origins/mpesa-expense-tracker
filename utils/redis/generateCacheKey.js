module.exports = (req, prefix) => {
  let query = "";
  const queryKeys = Object.keys(req.query || {});
  if (queryKeys.length) {
    if (queryKeys.length > 1) {
      //normalize the order
      query =
        ":" +
        JSON.stringify(
          queryKeys.sort().reduce((obj, key) => {
            obj[key] = req.query[key];
            return obj;
          }, {})
        );
    } else {
      query = ":" + JSON.stringify(req.query);
    }
  }

  let params = "";
  if (req.params && Object.keys(req.params).length) {
    params = ":" + JSON.stringify(req.params);
  }

  return `${prefix}:${req.user.id}${params}${query}:`;
};
