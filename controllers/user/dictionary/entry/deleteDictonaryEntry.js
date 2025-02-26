module.exports = async (req, res, next) => {
  try {
    await req.dictionaryEntry.ref.delete();
    res.json({
      success: true,
      data: req.body,
      message: `Successfully deleted dictionary entry`,
    });
  } catch (error) {
    next(error);
  }
};
