const mongoose = require("mongoose");
const schema = mongoose.Schema;

const patientSchema = new schema({
  patientName: {
    type: String,
    default: "",
  },
  age: { type: Number, default: 0 },
  gender: { type: String, default: "" },
  phone: { type: String, default: "" },
  country: { type: String, default: "" },
  region: { type: String, default: "" },
  city: { type: String, default: "" },
  address: { type: String, default: "" },
  preDiagnosis: { type: String, default: "" },
});

const patient = new schema({
  patientCounter: { type: Number, unique: true },
  patient: [patientSchema],
});

module.exports = mongoose.model("Patient", patient);
