module.exports = async (req, res, next) => {
  try {
    await req.budgetItem.ref.delete();

    res.json({
      success: true,
      data: {},
      message: `successfully deleted item from budget`,
    });
  } catch (error) {
    next(error);
  }
};
