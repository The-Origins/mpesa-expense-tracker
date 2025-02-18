module.exports = (req, res, next) => {
  try {
    const { salt, hash, ...rest } = req.user;
    res.json({
      success: true,
      data: rest,
      message: `Successfully returned user`,
    });
  } catch (error) {
    next(error);
  }
};
