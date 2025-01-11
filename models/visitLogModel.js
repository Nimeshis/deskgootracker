const mongoose = require("mongoose");
const { Schema } = mongoose;

const visitModel = new Schema({
  pocId: { type: String, required: true },
  visitCount: { type: Number, default: 0 },
  visits: [
    {
      mobileTime: { type: String, default: "" },
      remark: { type: String, default: "" },
      timestamp: { type: String, default: "" },
      latitude: { type: Number, default: 0 },
      longitude: { type: Number, default: 0 },
    },
  ],
});

const visit = new Schema({
  _id: { type: String, required: true },
  visitLog_id: { type: Number, unique: true },
  visitedPoc: [visitModel],
});

module.exports = mongoose.model("Visit", visit);
