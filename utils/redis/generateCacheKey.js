module.exports = (req, key) => {
  let queries = "";
  const queryKeys = Object.keys(req.query || {});
  if (queryKeys.length) {
    queries = parseObj(queryKeys, req.query);
  }

  let params = "";
  const paramKeys = Object.keys(req.params || {});
  if (paramKeys.length) {
    params = parseObj(paramKeys, req.params, false);
  }

  const output = `${req.user.id}:${key}${params}${queries}`;
  console.log(output);
  return output;
};

const parseObj = (keys, obj, sort = true) => {
  let output = "";
  if (sort) {
    keys = keys.sort();
  }
  keys.forEach((key) => {
    output += `:${key}:${obj[key]}`;
  });
  return output;
};
