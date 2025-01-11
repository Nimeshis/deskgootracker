const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for 'POC'
const pocSchema = new Schema(
  {
    pocName: { type: String, required: true },
    age: { type: String, default: "" },
    number: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String, required: false, default: "" },
    specialization: { type: String, required: false, default: "" },
    organization: { type: String, required: false, default: "" },
    deleted: { type: Boolean, default: false },
    createdById: { type: String, required: true },
    createdByName: { type: String, required: true },
    visitCounter: { type: Number, default: 0 },
  },

  { timestamps: true }
);

module.exports = mongoose.model("POC", pocSchema);
