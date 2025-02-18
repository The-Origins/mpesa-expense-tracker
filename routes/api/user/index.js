const router = require("express").Router();

router.get(
  "/",
  require("../../../middleware/redis/getCachedData"),
  require("../../../controllers/user/fetchUser")
);
router.put("/update", require("../../../controllers/user/updateUser"));
router.delete("/delete", require("../../../controllers/user/deleteUser"));

router.use("/expenses", require("./expenses"));
router.use("/statistics", require("./statistics"));
router.use("/trash", require("./trash"));

router.use("/budget", require("./budget"));

router.use("/dictionary", require("./dictionary"));

router.use("/keywords", require("./keywords"));

module.exports = router;
