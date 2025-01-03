const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Define the schema for 'POC'
const pocSchema = new Schema(
  {
    name: { type: String, required: true },
    age: { type: String, default: "" },
    number: { type: String, required: true, unique: true },
    country: { type: String, required: true },
    region: { type: String, required: true },
    city: { type: String, required: true },
    address: { type: String, required: true },
    category: { type: String, required: true },
    specialization: { type: String, required: true },
    organization: { type: String, required: true },
    deleted: { type: Boolean, default: false },
    mobileTime: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("POC", pocSchema);
