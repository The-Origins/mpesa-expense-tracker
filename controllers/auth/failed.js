module.exports = (req, res, next) => {
    res.code = 401
    return next(new Error(`Error authorizing client`))
}