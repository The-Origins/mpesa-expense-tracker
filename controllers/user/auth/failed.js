module.exports = (req, res, next) => {
    res.code = 401
    next(new Error(`Error authorizing client`))
}