const {
  deleteUser,
  getAllUsers,
  refreshToken,
  registerUser,
} = require("../controllers/userController");
const express = require("express");
const router = express.Router();
router.route("/user").post(registerUser).get(getAllUsers).delete(deleteUser);
router.route("/refreshToken").post(refreshToken);

module.exports = router;
