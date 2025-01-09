const mongoose = require("mongoose");
const { Schema } = mongoose;

const visitSchema = new Schema({
  visitLog: [
    {
      visitCreationDate: { type: Date, default: Date.now },
      poc: [
        {
          pocId: { type: "string" },
          mobileTime: { type: String, default: "" },
          remark: { type: String, default: "" },
          timestamp: { type: String, default: "" },
          isVisited: { type: Boolean, default: false },
          visitType: { type: String, default: "New Visit" },
          latitude: {
            type: Number,
            default: 0,
            // required: true
          },
          longitude: {
            type: Number,
            default: 0,
            // required: true
          },
          visitCount: { type: Number, default: 0 },
        },
      ],
    },
  ],
});

module.exports = mongoose.model("Visit", visitSchema);
