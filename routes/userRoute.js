const express = require("express");
const bcrypt = require("bcrypt");
const router = express.Router();
const userModel = require("../models/userModel"); // Import the correct user model
const Counter = require("../models/counterModel");

// Function to get the next sequence value for each user's user_id
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Create if it doesn't exist
  );

  return sequenceDocument.sequence_value;
}

// Define your POST /User route
router.post("/User", async (req, res) => {
  try {
    const { username, email, number, password, role, resetMobile } = req.body; // No need to capture mobileIdentifier and mobileOS during registration

    // Check if the user already exists based on email or number
    let existingUser = await userModel.findOne({
      $or: [{ email }, { number }],
    });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists.",
      });
    } else {
      // Encrypt password before saving
      // const hashedPassword = await bcrypt.hash(password, 10); // Salt rounds = 10

      // Create new user ID
      const user_id = await getNextSequenceValue("user_id"); // Pass the string "user_id"

      // Create the new user without mobileIdentifier and mobileOS
      const newUser = new userModel({
        user_id, // Include the user_id here
        username,
        email,
        number,
        password,
        role,
        resetMobile,
        mobileIdentifier: "", // Initially set to an empty string
        mobileOS: "", // Initially set to an empty string
        serverTime: new Date().toISOString(),
      });

      await newUser.save();

      return res.status(201).json({
        message: "New user created successfully.",
        newUser: {
          user_id: newUser.user_id, // Explicitly include user_id in the response
          username: newUser.username,
          email: newUser.email,
          number: newUser.number,
          role: newUser.role,
          resetMobile: newUser.resetMobile,
        },
      });
    }
  } catch (error) {
    console.error("Error adding user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Define your GET /user route
// router.get("/user", async (req, res) => {
//   try {
//     const { user_id } = req.query;

//     const user = await userModel.findOne({ user_id: Number(user_id) });

//     if (!user) {
//       return res.status(404).json({ message: "User not found." });
//     }

//     return res.status(200).json({
//       message: "User data fetched successfully.",
//       user_id: user.user_id,
//       mobileIdentifier: user.mobileIdentifier,
//       username: user.username, // Access user directly, not nested
//       number: user.number,
//       email: user.email,
//     });
//   } catch (error) {
//     console.error("Error fetching user:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

router.get("/user", async (req, res) => {
  try {
    // Find all users
    const users = await userModel.find({});
    // const locations = await locationModel.find({});

    if (!users.length) {
      return res.status(404).json({ message: "No users found." });
    }

    return res.status(200).json({
      message: "Users fetched successfully.",
      users: users.map((user) => ({
        user_id: user.user_id,
        mobileIdentifier: user.mobileIdentifier,
        username: user.username,
        password: user.password,
        number: user.number,
        email: user.email,
        role: user.role,
      })),
      // locations: locations.map((location) => ({
      //   location_id: location.location_id,
      //   latitude: location.latitude,
      //   longitude: location.longitude,
      //   deviceTIme: location.deviceTime,
      //   serverTime: location.serverTime,
      // })),
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

//delete all user

router.delete("/user", async (req, res) => {
  try {
    await userModel.deleteMany({});
    res.json({ message: "all user deleted" });
  } catch (err) {
    console.error("Error deleting all user:", err);
    res.status(500).json({ message: "Server error" });
  }
});
router.delete("/user/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Find the user by user_id and delete
    const user = await userModel.findOneAndDelete({
      user_id: Number(user_id),
    });

    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({
      message: `User with ID ${user_id} deleted successfully.`,
    });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
