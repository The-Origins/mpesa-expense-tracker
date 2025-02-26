module.exports = async (req, res, next) => {
  try {
    await req.dictionaryEntry.ref.set({ labels: req.body.labels });
    res.json({
      success: true,
      data: req.body,
      message: `Successfully set dictionary entry`,
    });
  } catch (error) {
    next(error);
  }
};
