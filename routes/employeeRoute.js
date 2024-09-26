const express = require("express");
const router = express.Router;
const employeeModel = require("../models/employeeModel");

// GET all employees
router.get("/", async (req, res) => {
  try {
    const employees = await employeeModel.find({});
    res.json(employees);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single employee by ID
router.get("/:id", getEmployee, (req, res) => {
  res.json(res.employee);
});
