const mongoose = require("mongoose");
const router = mongoose.Router;

const employeeSchema = new Schema({
  employee_name: {
    type: String,
    required: true,
  },
  date_of_birth: {
    type: Date,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  address: {
    type: String,
    required: true,
  },
  marital_status: {
    type: String,
    required: true,
  },
  date_of_joining: {
    type: Date,
    required: true,
  },
  department: {
    type: String,
    required: true,
  },
  designation: {
    type: String,
    required: true,
  },

  shift: {
    type: String,
    required: true,
  },
  //   attendance_id: {
  //     type: String,
  //     required: true,
  //     unique: true,
  //   },
  date_of_retirement: {
    type: Date,
    required: false,
  },
  notice_period: {
    type: Number,
    required: false,
  },
});
module.exports = model.mongoose("employeeModel", employeeSchema);
