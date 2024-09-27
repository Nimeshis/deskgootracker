const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const LoginModelSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    // required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  empIdentifier: {
    type: String,
    required: true,
    unique: true,
  },
  // geofence: {
  //   type: Schema.Types.Mixed,
  //   required: true,
  // },
});
module.exports = mongoose.model("LoginModel", LoginModelSchema);
