const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const Schema = mongoose.Schema;

const UserModelSchema = new Schema({
  userMob_id: {
    type: Number,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
  },
  mobileIdentifier: {
    type: String,
    required: true,
    unique: true,
  },
  role: {
    type: String,
    required: true,
  },
  resetMobile: {
    type: Boolean,
    default: true,
  },
  mobileOs: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("UserModel", UserModelSchema);
