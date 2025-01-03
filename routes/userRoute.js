const {
  deleteUser,
  getAllUsers,
  refreshToken,
  registerUser,
  updateFBNotificationToken,
} = require("../controllers/userController");
const express = require("express");
const router = express.Router();
router.route("/user").post(registerUser).get(getAllUsers).delete(deleteUser);
router.route("/refreshToken").post(refreshToken);
router.route("/updateFBToken").post(updateFBNotificationToken);

module.exports = router;
