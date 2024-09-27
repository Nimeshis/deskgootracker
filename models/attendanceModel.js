const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceModelSchema = new Schema({
  cin_coutbool: {
    type: Boolean,
    required: true,
  },
  cin_coutaction: {
    type: Boolean,
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
  mobileIdentifier: {
    type: String,
    // required: true,
  },
  mobileTime: {
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
