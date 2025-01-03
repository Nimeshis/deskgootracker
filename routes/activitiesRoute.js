const express = require("express");
const router = express.Router();

//get the users activitie all at once
router.get("/", async (req, res) => {
  try {
    const activities = await activities.find();
    res.json(activities);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
