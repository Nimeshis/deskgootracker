// const mongoose = require("mongoose");
// const bcrypt = require("bcrypt");
// const Schema = mongoose.Schema;

// const UserModelSchema = new Schema({
//   user_id: {
//     type: Number,
//     required: true,
//     unique: true,
//   },
//   username: {
//     type: String,
//     required: true,
//   },
//   email: {
//     type: String,
//     unique: true,
//   },
//   number: {
//     type: Number,
//     unique: true,
//   },
//   password: {
//     type: String,
//     required: true,
//   },
//   mobileIdentifier: {
//     type: String,
//     // required: true,
//     // unique: true,
//   },
//   role: {
//     type: String,
//     required: true,
//   },
//   // resetMobile: {
//   //   type: Boolean,
//   //   default: true,
//   // },
//   // mobileOs: {
//   //   type: String,
//   //   required: true,
//   // },
// });

// // Hash the password before saving the user
// UserModelSchema.pre("save", async function (next) {
//   try {
//     // Only hash the password if it's new or modified
//     if (!this.isModified("password")) return next();

//     // Hash the password with bcrypt
//     const salt = await bcrypt.genSalt(10);
//     this.password = await bcrypt.hash(this.password, salt);

//     next();
//   } catch (err) {
//     next(err);
//   }
// });

// module.exports = mongoose.model("UserModel", UserModelSchema);
