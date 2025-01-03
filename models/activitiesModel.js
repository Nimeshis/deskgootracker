const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const activities = new Schema({
  employee_id: {
    type: String,
    required: true,
  },
  mobileIdentifier: {
    type: String,
    required: true,
  },
  date: {
    type: string,
    required: true,
  },
  activity: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  remarks: {
    type: String,
    default: "",
  },
});

module.exports = mongoose.model("activities", activities);
