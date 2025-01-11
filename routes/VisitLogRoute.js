const express = require("express");
const router = express.Router();
const {
  getVisitLog,
  postNewVisitLog,
  followUpVisit,
  updatePocStatus,
} = require("../controllers/visitLogController");

router
  .route("/visitLog")
  .post(postNewVisitLog)
  .get(getVisitLog)
  .put(updatePocStatus);
router.route("/followup").post(followUpVisit);
module.exports = router;
