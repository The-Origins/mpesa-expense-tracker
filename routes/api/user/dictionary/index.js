const router = require("express").Router()

router.get("/", require("../../../../controllers/user/dictionary/fetchDictionary"))

module.exports = router