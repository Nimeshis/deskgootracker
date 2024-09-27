const express = require("express");
const router = express.Router();
const DeviceLocation = require("../models/locationModel"); // Ensure this path is correct
const Counter = require("../models/counterModel"); // Import your counter model

// Function to get the next sequence value
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Create if it doesn't exist
  );

  return sequenceDocument.sequence_value;
}
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
//route to post device location
router.post("/device", async (req, res) => {
  try {
    const {
      mobileIdentifier,
      employeeName,
      latitude,
      longitude,
      battery_percentage,
      accuracy,
      deviceTime,
    } = req.body;

    const newLocation = {
      latitude,
      longitude,
      battery_percentage,
      accuracy,
      deviceTime: formatDateTime(new Date(deviceTime)),
      serverTime: formatDateTime(new Date()),
    };

    let device = await DeviceLocation.findOne({
      mobileIdentifier: mobileIdentifier,
    });

    if (device) {
      device.locations.push(newLocation);
      await device.save();
      return res.status(200).json({
        message: "Location data appended successfully.",
        device,
      });
    } else {
      const mobile_id = await getNextSequenceValue("mobile_id");

      const newDevice = new DeviceLocation({
        mobile_id,
        mobileIdentifier: mobileIdentifier,
        employeeName,
        locations: [newLocation],
      });

      await newDevice.save();
      return res.status(201).json({
        message: "New device created successfully.",
        newDevice,
      });
    }
  } catch (error) {
    console.error("Error adding device:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

// Route to fetch device locations
router.get("/device", async (req, res) => {
  try {
    const { mobile_id } = req.query;

    if (mobile_id) {
      const device = await DeviceLocation.findOne({ mobile_id });
      if (!device) {
        return res.status(404).json({ message: "DeviceLocation not found" });
      }

      // Get the latest location
      const latestLocation = device.locations.sort(
        (a, b) => new Date(b.deviceTime) - new Date(a.deviceTime)
      )[0];

      return res.status(200).json({
        message: "Latest data for the device fetched successfully",
        mobile_id: device.mobile_id,
        mobileIdentifier: device.mobileIdentifier,
        employee_name: device.employeeName, // Use employeeName
        latestLocation,
      });
    } else {
      // Find all devices and return the latest location for each
      const devices = await DeviceLocation.find({});
      const latestData = devices.map((device) => ({
        mobile_id: device.mobile_id,
        employee_name: device.employeeName, // Use employeeName
        mobileIdentifier: device.mobileIdentifier,
        latestLocation: device.locations.sort(
          (a, b) => new Date(b.deviceTime) - new Date(a.deviceTime)
        )[0],
      }));

      return res.status(200).json({
        message: "Latest data for all devices fetched successfully",
        latestData,
      });
    }
  } catch (error) {
    console.error("Error fetching devices:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.get("/location/:mobile_id", async (req, res) => {
  try {
    const { mobile_id } = req.params;
    const { start, end } = req.query;

    // Find the device by mobile_id
    const device = await DeviceLocation.findOne({
      mobile_id: Number(mobile_id),
    });
    if (!device) {
      return res.status(404).json({ message: "Device Location not found" });
    }

    let locations = device.locations;

    // Filter locations based on date range if provided
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);

      // Check for valid date ranges
      if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
        return res.status(400).json({ message: "Invalid date format" });
      }

      // Filter locations based on the provided time frame
      locations = locations.filter((location) => {
        const locationDate = new Date(location.deviceTime);
        return locationDate >= startDate && locationDate <= endDate;
      });
    }

    return res.status(200).json({
      message: "Locations fetched successfully",
      mobile_id: device.mobile_id,
      employee_name: device.employeeName, // Use employeeName
      locations,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/device", async (req, res) => {
  try {
    await DeviceLocation.deleteMany({});
    res.json({ message: "all location deleted" });
  } catch (err) {
    console.error("Error deleting all locations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
