module.exports = async (req, res, next) =>
{
    try {
        res.status(200).json({success:true, data:req.expense, message:"Successfully returned expense"})
    } catch (error) {
        next(error)
    }
}