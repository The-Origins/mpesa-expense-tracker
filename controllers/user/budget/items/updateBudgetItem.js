module.exports = async (req, res, next) => {
  try {
    const {label, id, ...rest} = req.body
    await req.budgetItemDocument.update(rest);

    res.json({
      success: true,
      data: {},
      message: `successfully updated budget item: ${req.budgetItemDocument.id}`,
    });
  } catch (error) {
    next(error);
  }
};
