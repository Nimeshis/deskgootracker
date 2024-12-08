const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the visitLog schema
const visitLogSchema = new Schema({
  visit_id: {
    type: Number,
    unique: true,
  },
  visitTimestamp: {
    type: String,
    required: true,
  },
  nameOfPoc: {
    type: String,
    required: true,
  },
  age: {
    type: String,
    required: false,
    default: "",
  },
  number: {
    type: String,
    required: false,
    default: "",
  },
  visitType: {
    type: String,
    required: true,
    default: "",
  },
  category: {
    type: String,
    required: true,
    default: "",
  },
  otherCategory: {
    type: String,
    required: false,
    default: "",
  },
  specialization: {
    type: String,
    required: true,
    default: "",
  },
  organization: {
    type: String,
    required: false,
    default: "",
  },
  country: {
    type: String,
    required: true,
    default: "",
  },
  district: {
    type: String,
    required: false,
    default: "",
  },
  state: {
    type: String,
    required: false,
    default: "",
  },
  city: {
    type: String,
    required: true,
    default: "",
  },
  address: {
    type: String,
    required: true,
    default: "",
  },
  remarks: {
    type: String,
    required: false,
    default: "",
  },
  executiveOfficer: {
    type: String,
    required: true,
    default: "",
  },
  gpsLocation: {
    type: String,
    required: true,
    default: "",
  },
  latitude: {
    type: String,
    required: true,
    default: "",
  },
  longitude: {
    type: String,
    required: true,
    default: "",
  },
});
module.exports = mongoose.model("VisitLog", visitLogSchema);
