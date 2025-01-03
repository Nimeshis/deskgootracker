const {
  getAllCountry,
  getCountryByName,
} = require("../controllers/countryController");
const express = require("express");
const router = express.Router();

router.route("/country").get(getAllCountry).post(getCountryByName);
router.route("/country/:countryName").get(getCountryByName);

module.exports = router;
