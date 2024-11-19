const mongoose = require("mongoose");

const employeeDetailSchema = new mongoose.Schema({
  name: String,
  employee_name: String,
  date_of_birth: String,
  gender: String,
  email: String,
  address: String,
  marital_status: String,
  date_of_joining: String,
  department: String,
  designation: String,
  shift: String,
  date_of_retirement: String,
  notice_period: String,
});

module.exports = mongoose.model("EmployeeDetail", employeeDetailSchema);
