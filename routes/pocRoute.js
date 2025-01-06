const {
  postPOC,
  getPOCIdName,
  getPOCById,
  putPOCById,
} = require("../controllers/pocController");
const express = require("express");
const router = express.Router();

router.route("/poc").post(postPOC).get(getPOCIdName);
router.route("/poc/:id").get(getPOCById).put(putPOCById);

module.exports = router;
