const mongoose = require("mongoose");
const Schema = mongoose.Schema;

function formatDateTime(date) {
  const pad = (num) => (num < 10 ? "0" + num : num);
  return (
    date.getFullYear() +
    "-" +
    pad(date.getMonth() + 1) +
    "-" +
    pad(date.getDate()) +
    " " +
    pad(date.getHours()) +
    ":" +
    pad(date.getMinutes()) +
    ":" +
    pad(date.getSeconds())
  );
}

const LocationSchema = new Schema({
  latitude: {
    type: Number,
    required: true,
  },
  longitude: {
    type: Number,
    required: true,
  },
  deviceTime: {
    type: Date,
    // default: Date.now,
  },
  serverTime: {
    type: Date,
    default: Date.now,
  },
  battery_percentage: {
    type: Number,
    required: true,
  },
  accuracy: {
    type: Number,
    required: true,
  },
});

const DeviceSchema = new Schema(
  {
    mobile_id: {
      type: Number,
    },
    mobileIdentifier: {
      type: String,
      required: true,
      unique: true,
    },
    employeeName: {
      type: String,
      required: true,
    },
    locations: [LocationSchema],
  },
  {
    timestamps: true,
  }
);

const Device = mongoose.model("DeviceLocation", DeviceSchema);

module.exports = Device;
