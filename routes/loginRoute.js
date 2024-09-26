const express = require("express");
const router = express.Router();

// Define your login route
router.post("/login", (req, res) => {
  res.send("Login route");
});

// Export the router
module.exports = router;
