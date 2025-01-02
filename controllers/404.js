module.exports = (req, res, next) => {
  res.code = 404;
  next(new Error(`cannot ${req.method} ${req.url}`));
};
