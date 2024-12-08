const express = require("express");
const router = express.Router();
const AttendanceModel = require("../models/attendanceModel");

router.post("/", async (req, res) => {
  try {
    const { status, biometricId, mobileTime, lat, long } = req.body;

    // Check if attendance record exists for the biometricId
    let attendance = await AttendanceModel.findOne({ biometricId });

    if (attendance) {
      // Update the existing attendance record
      attendance.status = status;
      attendance.mobileTime = mobileTime;
      attendance.lat = lat;
      attendance.long = long;
      attendance.serverTime = new Date(); // Use the current date/time
      await attendance.save();

      res.status(200).json({ message: "Attendance updated successfully." });
    } else {
      // Create a new attendance record
      const newAttendance = new AttendanceModel({
        status,
        biometricId,
        mobileTime,
        lat,
        long,
        serverTime: new Date(), // Use the current date/time
        mobileIdentifier: "", // Set default value for mobileIdentifier
      });

      await newAttendance.save();
      res.status(201).json({ message: "Attendance saved successfully." });
    }
  } catch (err) {
    console.error("Error:", err.message);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
