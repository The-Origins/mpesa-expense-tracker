module.exports = (err, req, res, next) => {
    if (err) {
      res
        .status(res.code || 500)
        .json({ success: false, data: [], message: err.message });
    }
    next();
  };
  