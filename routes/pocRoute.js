const express = require("express");
const router = express.Router();
const POC = require("../models/pocModel");

// GET all POC id and address only
router.get("/poc", async (req, res) => {
  try {
    const pocs = await POC.find({}, "_id address name deleted ");
    if (!pocs) return res.status(404).json({ message: "No POCs found" });
    res.json(pocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET a single POC by id
router.get("/poc/:id", async (req, res) => {
  try {
    const poc = await POC.findById(req.params.id);
    if (!poc) return res.status(404).json({ message: "POC not found" });
    res.json(poc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST a new POC
router.post("/poc", async (req, res) => {
  try {
    const existingPOC = await POC.findOne({ number: req.body.number });
    if (existingPOC)
      return res.status(400).json({ message: "POC already exists" });

    const poc = new POC(req.body); // No need to manually set 'deleted' here
    await poc.save();
    res.status(201).json(poc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
// UPDATE a POC by id
router.put("/poc/:id", async (req, res) => {
  try {
    const updatedPOC = await POC.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPOC) return res.status(404).json({ message: "POC not found" });
    res.json(updatedPOC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
