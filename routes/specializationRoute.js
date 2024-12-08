const express = require("express");
const router = express.Router();
const Specialization = require("../models/specializationModel");

// Get all specializations
router.get("/specialization", async (req, res) => {
  try {
    const specializations = await Specialization.find();
    res.json(specializations);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

//post the specializations
router.post("/specialization", async (req, res) => {
  try {
    const specializations = req.body; // Expecting an array of objects
    const insertions = specializations.map(async (spec) => {
      const exists = await Specialization.findOne({
        SpecializationName: spec.SpecializationName,
      });
      if (!exists) {
        return Specialization.create(spec);
      }
    });

    // Wait for all insertions to complete
    await Promise.all(insertions);

    res.json({ message: "Specializations added successfully" });
  } catch (err) {
    res.status(500).json({ message: `Error: ${err.message}` });
  }
});

module.exports = router;
