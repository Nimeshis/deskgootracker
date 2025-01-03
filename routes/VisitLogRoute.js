const express = require("express");
const router = express.Router();
const {
  getVisitLog,
  postVisitLog,
} = require("../controllers/visitLogController");

router.route("/visitLog").post(postVisitLog).get(getVisitLog);
module.exports = router;
