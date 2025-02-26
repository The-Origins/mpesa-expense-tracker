const fetchDictionaryEntry = require("../../../../../middleware/user/dictionary/fetchDictionaryEntry");

const router = require("express").Router();

router.post(
  "/add",
  fetchDictionaryEntry,
  require("../../../../../controllers/user/dictionary/entry/setDictonaryEntry")
);

router.put(
  "/update",
  fetchDictionaryEntry,
  require("../../../../../controllers/user/dictionary/entry/setDictonaryEntry")
);

router.delete(
  "/delete",
  fetchDictionaryEntry,
  require("../../../../../controllers/user/dictionary/entry/deleteDictonaryEntry")
);

module.exports = router;
