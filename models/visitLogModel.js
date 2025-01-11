const mongoose = require("mongoose");
const { Schema } = mongoose;

const visitModel = new Schema({
  _id: { type: String, required: true }, // User ID or unique identifier
  visitedPoc: [
    {
      pocId: { type: String, required: true }, // Unique identifier for the Point of Contact (POC)
      visitCount: { type: Number, default: 0 }, // Counter for visits
      visits: [
        {
          mobileTime: { type: String, default: "" },
          remark: { type: String, default: "" },
          timestamp: { type: String, default: "" },
          latitude: { type: Number, default: 0 },
          longitude: { type: Number, default: 0 },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Visit", visitModel);
