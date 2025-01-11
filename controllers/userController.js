const User = require("../models/userModel");
const Attendance = require("../models/attendanceModel");
const Location = require("../models/locationModel");
const jwt = require("jsonwebtoken");
const VisitLog = require("../models/visitLogModel");

// Helper function to generate both access and refresh tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" } // Access token expires in 1 hour
  );

  const refreshToken = jwt.sign(
    { userId: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" } // Refresh token expires in 7 days
  );

  return { accessToken, refreshToken };
};

//firebase Notification
const updateFBNotificationToken = async (req, res) => {
  try {
    const fbNotificationToken = req.body.fbNotificationToken;
    const userId = req.body.userId;

    const user = await user.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found." });
    user.fbNotificationToken = fbNotificationToken;
    await user.save();
    res
      .status(200)
      .json({ message: "FB Notification Token updated successfully." });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server Error.", error: err.message });
  }
};

// Register new user
const registerUser = async (req, res) => {
  try {
    const { fullName, email, number, password, role } = req.body;

    // Check if user already exists
    let existingUser = await User.findOne({
      $or: [{ email }, { number }],
    });

    if (existingUser) {
      return res.status(400).json({ message: "User already exists." });
    }

    //create random number
    const randomNumber = Math.floor(Math.random() * 900000) + 100000;

    // Create new user
    const newUser = new User({
      fullName,
      email,
      number,
      password,
      role,
      mobileIdentifier: randomNumber,
    });

    await newUser.save();
    // Create an attendance record for the new user
    const createAttendanceId = await Attendance.create({
      _id: newUser._id,
    });
    createAttendanceId.save();
    // Create location record for the new user
    const createLocationId = await Location.create({
      _id: newUser._id,
      fullName: newUser.fullName,
      mobileIdentifier: newUser.mobileIdentifier,
    });
    createLocationId.save();

    // const createVisitLog = await VisitLog.create({
    //   _id: newUser._id,
    //   fullName: newUser.fullName,
    //   timestamp: new Date(),
    // });
    // createVisitLog.save();

    return res.status(201).json({
      message: "User registered successfully",
      newUser,
      attendance: createAttendanceId,
      location: createLocationId,
    });
  } catch (error) {
    console.error("Error registering user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Login user and generate token
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email and password are required." });
    }

    // Find the user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    // Use the comparePassword method from the model to compare the password
    const passwordMatch = await user.comparePassword(password);
    console.log(passwordMatch, password, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid email or password." });
    }

    // Generate both access and refresh tokens
    const { accessToken, refreshToken } = generateTokens(user);

    // Save refresh token in the user model
    user.refreshToken = refreshToken;
    await user.save();

    return res.status(200).json({
      message: "Login successful",
      accessToken,
      refreshToken,
      user: {
        userId: user._id,
        username: user.fullName,
        email: user.email,
        role: user.role,
        firstLogin: user.firstLogin,
        resetMobile: user.resetMobile,
      },
    });
  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Refresh access token using refresh token
const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token required" });
    }

    // Verify refresh token
    jwt.verify(refreshToken, process.env.JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res
          .status(403)
          .json({ message: "Invalid or expired refresh token" });
      }

      // Find the user based on the decoded userId from the refresh token
      const user = await User.findById(decoded.userId);
      if (!user || user.refreshToken !== refreshToken) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Generate a new access token and refresh token
      const { accessToken } = generateTokens(user);

      // await user.save();

      return res.status(200).json({
        accessToken,
        refreshToken,
      });
    });
  } catch (error) {
    console.error("Error during refresh token:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Reset user password
const resetPassword = async (req, res) => {
  try {
    const { odlPassword, email, password, confirmPassword } = req.body;

    if (!email || !password || !confirmPassword || oldPassword) {
      return res.status(400).json({
        message: "oldPassword, password and confirm password are required.",
      });
    }
    const checkUser = await User.findOne({ email });
    if (!checkUser) {
      return res.status(404).json({ message: "User not found." });
    }

    // Use the comparePassword method from the model to compare the password
    const passwordMatch = await user.comparePassword(oldPassword);
    console.log(passwordMatch, oldPassword, user.password);
    if (!passwordMatch) {
      return res.status(400).json({ message: "Invalid password." });
    }

    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Passwords do not match." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    user.password = password;
    user.firstLogin = false;
    user.resetMobile = false;
    await user.save();

    return res.status(200).json({ message: "Password reset successful." });
  } catch (error) {
    console.error("Error resetting password:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Fetch all users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({});
    if (users.length === 0) {
      return res.status(404).json({ message: "No users found." });
    }
    const data = users.map((user) => ({
      fullName: user.fullName,
      email: user.email,
      number: user.number,
      role: user.role,
      mobileIdentifier: user.mobileIdentifier,
      firstLogin: user.firstLogin,
      resetMobile: user.resetMobile,
    }));
    return res
      .status(200)
      .json({ message: "user fetched sucessfylly", data: data });
  } catch (error) {
    console.error("Error fetching users:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Delete a user
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const user = await User.findByIdAndDelete(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User deleted successfully." });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

//logout
const logout = async (req, res) => {
  try {
    const { userId } = req.body;

    const user = await User.findByIdAndUpdate(userId, { refreshToken: null });
    if (!user) {
      return res.status(404).json({ message: "User not found." });
    }

    return res.status(200).json({ message: "User logged out successfully." });
  } catch (error) {
    console.error("Error logging out user:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  registerUser,
  loginUser,
  refreshToken,
  resetPassword,
  getAllUsers,
  deleteUser,
  updateFBNotificationToken,
  logout,
};
