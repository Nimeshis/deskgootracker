const mongoose = require("mongoose");
const schema = mongoose.Schema;

const referralSchema = new schema(
  {
    patientId: { type: String, required: true },
    referredBy: { type: String, required: true },
    mrId: { type: String, required: true },
    mobileTime: { type: String, required: false },
    serverTime: { type: Date, default: Date.now() },
  },
  {
    timestamps: true,
  }
);
const referral = new schema({
  referralCounter: { type: Number, unique: true },
  referrals: [referralSchema],
});
module.exports = mongoose.model("mongoose", referral);
