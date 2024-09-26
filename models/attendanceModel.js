const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceModelSchema = new Schema({
  bool: {
    type: Boolean,
    required: true,
  },
  action: {
    type: Boolean,
    required: true,
  },
  attendanceType: {
    type: String,
    required: true,
  },
  cInTime: {
    type: DateTime,
    required: true,
  },
  cOutTime: {
    type: DateTime,
    required: true,
  },
  empIdentifier: {
    type: String,
    ref: "Employee",
  },
  deviceTime: {
    type: DateTime,
    required: true,
  },
  serverTime: {
    type: DateTime,
    required: true,
  },
  geofence: {
    type: Schema.Types.Mixed,
    required: true,
  },
});
module.exports = mongoose.model("AttendanceModel", AttendanceModelSchema);
