const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Schema with array field
const SpecializationSchema = new Schema({
  specializations: [String], // Array of strings to store medical specializations
});

module.exports = mongoose.model("Specialization", SpecializationSchema);
