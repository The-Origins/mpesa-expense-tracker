const router = require("express").Router();

router.get("/*", require("../../../../controllers/user/statistics/getStatistics"))
module.exports = router;
