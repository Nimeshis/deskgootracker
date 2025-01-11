const mongoose = require("mongoose");
const schema = mongoose.Schema;

const patientSchema = new schema({
  patientName: {
    type: String,
  },
  age: { type: Number },
  gender: { type: String },
  phone: { type: String },
  country: { type: String },
  region: { type: String },
  city: { type: String },
  address: { type: String },
  preDiagnosis: { type: String },
});

module.exports = mongoose.model("Patient", patientSchema);
