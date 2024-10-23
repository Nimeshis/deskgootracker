const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const UserModel = require("../models/userModel"); // Adjust the path to your user model

// Login route
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body; // Expecting email instead of username

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find the user by email only
    const user = await UserModel.findOne({ email: email });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Compare the provided password with the hashed password
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    // Successful login response
    return res.status(200).json({
      message: "Login successful",
      role: user.role,
      user_id: user.user_id,
      username: user.username,
      email: user.email,
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
