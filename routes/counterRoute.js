const express = require("express");
const router = express.Router();
const Counter = require("../models/counterModel");
const bodyParser = require("body-parser");

router.use(bodyParser.json());

router.get("/counter", async (req, res) => {
  try {
    const counters = await Counter.find();
    res.json(counters);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.delete("/counter", async (req, res) => {
  try {
    await Counter.deleteMany({});

    // Return a success message
    res.json({ message: "All counters deleted" });
  } catch (err) {
    // If an error occurs during the delete operation, return a 500 error
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
