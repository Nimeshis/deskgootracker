const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceModelSchema = new Schema({
  status: {
    type: String,
    required: true,
  },
  mobileTime: {
    type: String,
    required: true,
  },
  serverTime: {
    type: Date, // Changed from String to Date
    default: Date.now, // Changed to function
  },
  lat: {
    type: Number,
    required: true,
  },
  long: {
    type: Number,
    required: true,
  },
  mobileIdentifier: {
    type: String,
  },
  biometricId: {
    type: String,
  },
});

module.exports = mongoose.model("AttendanceModel", AttendanceModelSchema);
