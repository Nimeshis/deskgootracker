const express = require("express");
const router = express.Router();
const {
  getVisitLog,
  postNewVisitLog,
} = require("../controllers/visitLogController");

router.route("/visitLog").post(postNewVisitLog).get(getVisitLog);
module.exports = router;
