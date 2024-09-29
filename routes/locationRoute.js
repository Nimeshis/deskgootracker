const express = require("express");
const router = express.Router();
const DeviceLocation = require("../models/locationModel");
const Counter = require("../models/counterModel");

// Function to get the next sequence value for each device's location_id
// async function getNextSequenceValueForDevice(deviceIdentifier) {
//   const sequenceDocument = await Counter.findOneAndUpdate(
//     { _id: `location_id_${deviceIdentifier}` }, // Unique counter per device
//     { $inc: { sequence_value: 1 } },
//     { new: true, upsert: true } // Create if not exist
//   );

//   return sequenceDocument.sequence_value;
// }

// Route to handle location updates
router.post("/location", async (req, res) => {
  try {
    const {
      mobileIdentifier,
      employeeName,
      latitude,
      longitude,
      batteryPercentage,
      accuracy,
      deviceTime,
      connectivityType,
      connectivityStatus,
      distance,
    } = req.body;

    // Generate unique location_id for this specific device
    // const location_id = await getNextSequenceValueForDevice(mobileIdentifier);

    // Create new location object
    const newLocation = {
      // location_id,
      latitude,
      longitude,
      batteryPercentage,
      accuracy,
      deviceTime,
      serverTime: new Date().toISOString(),
      connectivityType,
      connectivityStatus,
      distance,
    };

    // Check if the device already exists
    let device = await DeviceLocation.findOne({ mobileIdentifier });

    if (device) {
      // Append new location if the device exists
      device.locations.push(newLocation);
      await device.save();
      return res.status(200).json({
        message: "Location data appended successfully.",
        device,
      });
    } else {
      // Create a new device if not exists
      const mobile_id = await getNextSequenceValueForDevice("mobile_id");

      const newDevice = new DeviceLocation({
        mobile_id,
        mobileIdentifier,
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

module.exports = router;

// Route to fetch device locations
router.get("/location", async (req, res) => {
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
        totalDistance: device.totalDistance,
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
        totalDistance: device.totalDistance,
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
      totalDistance: device.totalDistance,
    });
  } catch (error) {
    console.error("Error fetching locations:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

router.delete("/location", async (req, res) => {
  try {
    await DeviceLocation.deleteMany({});
    res.json({ message: "all location deleted" });
  } catch (err) {
    console.error("Error deleting all locations:", err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
