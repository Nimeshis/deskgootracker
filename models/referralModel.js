const mongoose = require("mongoose");
const schema = mongoose.Schema;

const referralSchema = new schema(
  {
    patientId: { type: String, required: false },
    referredBy: { type: String, required: false },
    deviceTime: { type: String, required: false },
    serverTime: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);
module.exports = mongoose.model("mongoose", referralSchema);
