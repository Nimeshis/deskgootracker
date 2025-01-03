const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");

const UserModelSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, // `sparse` allows null values while maintaining uniqueness
    number: { type: Number, unique: true, sparse: true },
    password: { type: String, required: true },
    mobileIdentifier: { type: String, default: "" },
    role: {
      type: String,
      default: "",
    },
    firstLogin: { type: Boolean, default: true },
    resetMobile: { type: Boolean, default: true },
    refreshToken: {
      type: String,
      required: false,
      default: "",
    },
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
