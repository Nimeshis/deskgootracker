const express = require("express");
const axios = require("axios");
const mongoose = require("mongoose");
const employeeModel = require("../models/employeeModel");
const loginToFrappe = require("../utils/frappeLogin");

const router = express.Router();

router.get("/fetch-employees", async (req, res) => {
  try {
    const cookies = await loginToFrappe();

    const base_url = "http://108.181.195.185:8000/api/resource/Employee";

    //  Fetch employee names/IDs
    const response = await axios.get(base_url, {
      headers: { Cookie: cookies.join("; ") },
    });
    const employeeList = response.data.data;

    for (const employee of employeeList) {
      const employeeId = employee.name;

      // Fetch full details
      const detailResponse = await axios.get(`${base_url}/${employeeId}`, {
        headers: { Cookie: cookies.join("; ") },
      });
      const employeeData = detailResponse.data.data;

      const newEmployeeData = {
        employee_name: employeeData.employee_name,
        date_of_birth: employeeData.date_of_birth,
        gender: employeeData.gender,
        email: employeeData.email,
        address: employeeData.address,
        marital_status: employeeData.marital_status,
        date_of_joining: employeeData.date_of_joining,
        department: employeeData.department,
        designation: employeeData.designation,
        shift: employeeData.shift,
        date_of_retirement: employeeData.date_of_retirement,
        notice_period: employeeData.notice_period,
      };

      // Check if the employee already exists
      let existingEmployee = await employeeModel.findOne({
        email: employeeData.email,
      });

      if (existingEmployee) {
        // Update existing employee
        await employeeModel.updateOne(
          { email: employeeData.email },
          newEmployeeData
        );
      } else {
        // Save new employee
        const newEmployee = new employeeModel(newEmployeeData);
        await newEmployee.save();
      }
    }

    res.status(200).send("employeeModel data fetched and saved successfully.");
  } catch (error) {
    console.error("Error fetching employee data:", error);
    res.status(500).send("An error occurred while fetching employee data.");
  }
});

module.exports = router;
