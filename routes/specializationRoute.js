const express = require("express");
const router = express.Router();
const Specialization = require("../models/specializationModel");

// POST endpoint to save specializations dynamically
router.post("/specialization", async (req, res) => {
  try {
    const { specializations } = req.body;

    if (!specializations || !Array.isArray(specializations)) {
      return res.status(400).json({
        message:
          "Invalid data format. Please send an array of specializations.",
      });
    }

    const newSpecializations = new Specialization({ specializations });

    await newSpecializations.save();
    res.status(201).json({ message: "Specializations saved successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// GET endpoint to fetch specializations
router.get("/specialization", async (req, res) => {
  try {
    const result = await Specialization.findOne();
    if (!result) {
      return res.status(404).json({ message: "No specializations found" });
    }

    res.status(200).json(result.specializations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

//delete all the specializations
router.delete("/specialization", async (req, res) => {
  try {
    await Specialization.deleteMany();
    res
      .status(200)
      .json({ message: "All specializations deleted successfully!" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});
module.exports = router;
