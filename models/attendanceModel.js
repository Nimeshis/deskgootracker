const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const AttendanceModelSchema = new Schema({
  cin_coutbool: {
    type: Boolean,
    default: false,
    required: true,
  },

  // mobileIdentifier: {
  //   type: String,
  //   // required: true,
  // },
  mobileTime: {
    type: String,
    required: true,
  },
  serverTime: {
    type: String,
    default: Date.now(),
  },
  lat: {
    type: Number,
    required: true,
  },
  lng: {
    type: Number,
    required: true,
  },
  // geofence: {
  //   type: Schema.Types.Mixed,
  //   required: true,
  // },
});
module.exports = mongoose.model("AttendanceModel", AttendanceModelSchema);
