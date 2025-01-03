const express = require("express");
const router = express.Router();
const {
  getAttendanceById,
  postAttendanceByID,
  getAttendanceByIdAndDate,
} = require("../controllers/attendanceController");
router.route("/attendance/:id").get(getAttendanceById).post(postAttendanceByID);
router.route("/attendance/date/:id").get(getAttendanceByIdAndDate);

module.exports = router;
