const express = require("express");
const DeviceLocation = require("../models/locationModel");
const Counter = require("../models/counterModel");

// Function to get the next sequence value for each device's location_id
async function getNextSequenceValueForDevice(mobileIdentifier) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: `location_id_${mobileIdentifier}` }, // Unique counter per device
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Create if not exist
  );

  return sequenceDocument.sequence_value;
}
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Create if it doesn't exist
  );

  return sequenceDocument.sequence_value;
}

// Route to handle location updates
const postLocation = async (req, res) => {
  try {
    const {
      mobileIdentifier,
      fullName,
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
    const location_id = await getNextSequenceValueForDevice(mobileIdentifier);

    // Create new location object
    const newLocation = {
      location_id,
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
      // Ensure locations is an array
      if (!Array.isArray(device.locations)) {
        device.locations = [];
      }
      // Append new location
      device.locations.push(newLocation);
      await device.save();
      return res.status(200).json({
        message: "Location data appended successfully.",
        mobile_id: device.mobile_id,
        mobileIdentifier: device.mobileIdentifier,
        employee_name: device.fullName,
        latestLocation: newLocation,
        totalDistance: device.totalDistance,
      });
    } else {
      // Create a new device if not exists
      const mobile_id = await getNextSequenceValue("mobile_id");

      const newDevice = new DeviceLocation({
        mobile_id,
        mobileIdentifier,
        fullName,
        locations: [newLocation], // Initialize with first location
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
};
//location by mobile_id
const getLocationByID = async (req, res) => {
  try {
    const { mobile_id } = req.query;

    if (mobile_id) {
      // Find a specific device by mobile_id
      const device = await DeviceLocation.findOne({
        mobile_id: Number(mobile_id),
      });

      if (!device) {
        return res.status(404).json({ message: "DeviceLocation not found" });
      }

      const today = new Date();
      today.setHours(0, 0, 0, 0); // Today's date at 00:00:00

      // Filter only today's distances from the `locations`
      const todayDistances = device.locations?.filter(
        (location) => new Date(location.deviceTime) >= today
      );

      const totalDistanceToday =
        todayDistances?.reduce((sum, loc) => sum + loc.distance, 0) || 0;

      return res.status(200).json({
        message: `Device data for employee:${device.fullName} fetched successfully`,
        latestData: {
          mobile_id: device.mobile_id,
          employee_name: device.fullName,
          mobileIdentifier: device.mobileIdentifier,
          latestLocation: device.locations.slice(-1)[0],
          totalDistanceToday,
          totalDistance: device.totalDistance,
        },
      });
    }
  } catch (error) {
    console.error("Error fetching device:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Route to fetch device locations
const getAllLocation = async (req, res) => {
  try {
    // fetch all devices
    const devices = await DeviceLocation.find({});

    const latestData = devices.map((device) => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const todayDistances = device.locations?.filter(
        (location) => new Date(location.deviceTime) >= today
      );

      const totalDistanceToday =
        todayDistances?.reduce((sum, loc) => sum + loc.distance, 0) || 0;

      return {
        mobile_id: device.mobile_id,
        employee_name: device.fullName,
        mobileIdentifier: device.mobileIdentifier,
        latestLocation: device.locations.slice(-1)[0],
        totalDistanceToday,
        totalDistance: device.totalDistance,
      };
    });

    return res.status(200).json({
      message: "All devices data fetched successfully",
      latestData,
    });
  } catch (error) {
    console.error("Error fetching device data:", error);
    return res.status(500).json({ message: "Server error" });
  }
};

// const.get("/location/:mobile_id", async (req, res) => {
//   try {
//     const { mobile_id } = req.params;
//     const { start, end } = req.query;

//     // Find the device by mobile_id
//     const device = await DeviceLocation.findOne({
//       mobile_id: Number(mobile_id),
//     });
//     if (!device) {
//       return res.status(404).json({ message: "Device Location not found" });
//     }

//     let locations = device.locations;

//     // Filter locations based on date range if provided
//     if (start && end) {
//       const startDate = new Date(start);
//       const endDate = new Date(end);

//       // Check for valid date ranges
//       if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) {
//         return res.status(400).json({ message: "Invalid date format" });
//       }

//       // Filter locations based on the provided time frame
//       locations = locations.filter((location) => {
//         const locationDate = new Date(location.deviceTime);
//         return locationDate >= startDate && locationDate <= endDate;
//       });
//     }

//     return res.status(200).json({
//       data: {
//         message: "Locations fetched successfully",
//         mobile_id: device.mobile_id,
//         employee_name: device.fullName, // Use fullName
//         locations,
//         totalDistance: device.totalDistance,
//       },
//     });
//   } catch (error) {
//     console.error("Error fetching locations:", error);
//     return res.status(500).json({ message: "Server error" });
//   }
// });

//deleete al locations
const deleteAllLocation = async (req, res) => {
  try {
    await DeviceLocation.deleteMany({});
    res.json({ message: "all location deleted" });
  } catch (err) {
    console.error("Error deleting all locations:", err);
    res.status(500).json({ message: "Server error" });
  }
};
module.exports = {
  postLocation,
  getLocationByID,
  getAllLocation,
  deleteAllLocation,
};
