module.exports = (req, res, next) => {
  res.code = 404;
  return next(new Error(`cannot ${req.method} ${req.url}`));
};
