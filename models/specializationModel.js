const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const SpecializationModel = new mongoose.Schema({
  SpecializationName: {
    type: String,
  },
});
module.exports = mongoose.model("Specialization", SpecializationModel);
