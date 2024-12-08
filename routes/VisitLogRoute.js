const express = require("express");
const router = express.Router();
const VisitLog = require("../models/visitLogModel");
const Counter = require("../models/counterModel");

//counter value for the log
async function getNextSequence(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Create if it doesn't exist
  );

  return sequenceDocument.sequence_value;
}

//create log post route

router.post("/visitLog", async (req, res) => {
  try {
    const visit_id = await getNextSequence("visit_id");

    const visitLog = new VisitLog({ ...req.body, visit_id });

    const savedLog = await visitLog.save();

    res.status(201).json(savedLog);
  } catch (error) {
    console.error("Error saving visit log:", error);
    res.status(500).json({ error: "Failed to save visit log." });
  }
});

//get route for visitlog
router.get("/visitLog", async (req, res) => {
  try {
    const visitLogs = await VisitLog.find();
    res.status(200).json(visitLogs);
  } catch (error) {
    console.error("Error fetching visit logs:", error);
    res.status(500).json({ error: "Failed to fetch visit logs." });
  }
});

module.exports = router;
