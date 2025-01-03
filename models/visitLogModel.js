const mongoose = require("mongoose");
const schema = mongoose.Schema;

const visitSchema = new schema({
  employee: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  poc: { type: mongoose.Schema.Types.ObjectId, ref: "POC", required: true },
  visitDate: { type: Date, default: Date.now },
  mobileTime: { type: String, required: true },
  submissionLocation: {
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
  },
  remarks: { type: String, default: "" },
  // visitType:{type:String, default:""},
  visitCount: { type: Number, default: 1 },
});

module.exports = mongoose.model("VisitLog", visitSchema);
