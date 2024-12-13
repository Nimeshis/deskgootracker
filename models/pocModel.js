const mongoose = require("mongoose");
const schema = mongoose.Schema;

// Define the schema for the 'Poc'
const pocSchema = new schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  company: { type: String, required: true },
  position: { type: String, required: true },
  skills: { type: Array, required: true },
  availability: { type: String, required: true },
  comments: { type: String, required: false },
});
