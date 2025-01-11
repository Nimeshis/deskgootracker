const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserModelSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, required: true },
    number: { type: String, unique: true, default: "" },
    password: { type: String, required: true },
    mobileIdentifier: { type: String, default: "" },
    role: {
      type: String,
      default: "marketingOfficer",
    },
    firstLogin: { type: Boolean, default: true },
    resetMobile: { type: Boolean, default: true },
    refreshToken: {
      type: String,
      required: false,
      default: "",
    },
    accessToken: { type: String, default: "" },
    fbNotificationToken: { type: String, default: "" },
    visitLogCounter: { type: Number, unique: true },
    referralCounter: { type: Number, unique: true },
    referral: [
      {
        timestamp: { type: Date },
        referralId: { type: String, default: "" },
        referralBy: { type: String, default: "" },
        patientId: { type: String, default: "" },
        mobileTime: { type: String, default: "" },
      },
    ],
  },
  { timestamps: true }
);

// Hash password before saving
UserModelSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Method to compare passwords
UserModelSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model("User", UserModelSchema);
