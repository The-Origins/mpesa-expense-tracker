const router = require("express").Router();

router.use("/api", require("./api"))
router.all("*", require("../controllers/404"));
router.use(require("../middleware/errorHandler"));

module.exports = router;
