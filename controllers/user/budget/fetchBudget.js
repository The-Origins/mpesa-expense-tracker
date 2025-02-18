module.exports = async (req, res, next) => {
  try {
    if (!req.budget) {
      res.code = 404;
      throw new Error(`No user budget`);
    }

    res.json({
      success: true,
      data: {
        ...req.budget,
        overbudget: req.budget.current > req.budget.total,
      },
      message: `Successfully returned user budget`,
    });
  } catch (error) {
    next(error);
  }
};
