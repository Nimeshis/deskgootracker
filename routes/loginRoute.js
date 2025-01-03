const express = require("express");
const router = express.Router();
const {
  loginUser,
  refreshToken,
  resetPassword,
} = require("../controllers/userController");

router.route("/login").post(loginUser);
router.route("/resetPassword").post(resetPassword);
router.route("/refreshToken").post(refreshToken);

module.exports = router;
