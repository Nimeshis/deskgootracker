const mongoose = require("mongoose");
const DeviceLocation = require("./models/locationModel");
const Counter = require("./models/counterModel");

// Connect to the database
mongoose.connect("mongodb://localhost:27017/deviceLocation", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Function to get the next sequence value for mobile_id
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true }
  );

  return sequenceDocument.sequence_value;
}

async function migrateMobileId() {
  try {
    // Find all devices that don't have a mobile_id
    const devices = await DeviceLocation.find({
      mobile_id: { $exists: false },
    });

    for (let device of devices) {
      // Assign a new mobile_id using the counter
      const mobile_id = await getNextSequenceValue("mobile_id");

      // Update the device document with the new mobile_id
      await DeviceLocation.updateOne(
        { _id: device._id },
        { $set: { mobile_id } }
      );

      console.log(`Updated device ${device._id} with mobile_id: ${mobile_id}`);
    }

    console.log("Migration complete.");
    process.exit();
  } catch (error) {
    console.error("Error during migration:", error);
    process.exit(1);
  }
}

migrateMobileId();
