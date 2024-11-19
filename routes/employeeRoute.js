const express = require("express");
const router = express.router();
const employeeModel = require("../models/employeeModel");

router.get("/", async (req, res) => {
  try {
    const employees = await employeeModel.find();
    res.json(employees);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});

router.get("/:id", async (req, res) => {
  try {
    const employee = await employeeModel.findById(req.params.id);
    if (!employee) return res.status(404).send("Employee not found");
    res.json(employee);
  } catch (error) {
    console.error(error);
    res.status(500).send("Server error");
  }
});
