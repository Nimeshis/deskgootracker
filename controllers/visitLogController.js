const VisitLog = require("../models/visitLogModel");
const User = require("../models/userModel");
const POC = require("../models/pocModel");
const Counter = require("../models/counterModel");

//counter function
async function getNextSequenceValue(sequenceName) {
  const sequenceDocument = await Counter.findOneAndUpdate(
    { _id: sequenceName },
    { $inc: { sequence_value: 1 } },
    { new: true, upsert: true } // Create if it doesn't exist
  );

  return sequenceDocument.sequence_value;
}

//post new POC and visit log for that poc
const postNewVisitLog = async (req, res) => {
  try {
    const { number, createdById, createdByName, ...pocDetails } = req.body;

    // Check if POC already exists
    const existingPOC = await POC.findOne({ "poc.number": number });
    if (existingPOC) {
      return res
        .status(400)
        .json({ success: false, message: "POC already exists" });
    }

    // Create a new POC
    const newPoc = {
      pocName: pocDetails.pocName,
      age: pocDetails.age,
      number: number,
      country: pocDetails.country,
      region: pocDetails.region,
      city: pocDetails.city,
      address: pocDetails.address,
      category: pocDetails.category,
      specialization: pocDetails.specialization,
      organization: pocDetails.organization,
      ambNumber: pocDetails.ambNumber,
      createdById,
      createdByName,
      visitCounter: pocDetails.visitCounter || 1, // Set default if not provided
      referralCounter: pocDetails.referralCounter || 0,
      referral: pocDetails.referral || [],
      deleted: pocDetails.deleted || false,
    };
    console.log(newPoc);
    // Find the latest POC document to increment the pocCounter
    const pocCounter_id = await getNextSequenceValue("pocCounter_id");

    // Save the new POC document
    const poc = new POC({
      pocCounter_id,
      poc: [newPoc], // Saving the POC in the nested array
    });

    await poc.save();

    res.status(201).json({
      success: true,
      message: "POC created successfully",
      poc,
    });

    // Find the VisitLog for the employee
    let visitLog = await VisitLog.findOne({ _id: createdById });
    const visitLog_id = await getNextSequenceValue("visitLog_id");
    console.log({ "visitLog id": visitLog_id, visitLog: visitLog });
    if (!visitLog) {
      // Create a new VisitLog for the employee if it doesn't exist
      visitLog = new VisitLog({
        _id: createdById,
        visitLog_id,
        visitedPoc: [
          {
            pocId: poc._id,
            visitCount: 1, // First visit for this POC
            visits: [
              {
                mobileTime: pocDetails.mobileTime,
                remark: pocDetails.remarks || "",
                timestamp: new Date().toISOString(),
                latitude: pocDetails.latitude || 0,
                longitude: pocDetails.longitude || 0,
              },
            ],
          },
        ],
      });
    } else {
      // If VisitLog exists, check for the current day's log
      const pocIndex = visitLog.visitedPoc.findIndex(
        (poc) => poc.pocId.toString() === poc._id.toString()
      );

      if (pocIndex !== -1) {
        // If POC exists, update the visit count and add the new visit
        visitLog.visitedPoc[pocIndex].visitCount += 1;
        visitLog.visitedPoc[pocIndex].visits.push({
          mobileTime: pocDetails.mobileTime,
          remark: pocDetails.remarks || "",
          timestamp: new Date().toISOString(),
          latitude: pocDetails.latitude || 0,
          longitude: pocDetails.longitude || 0,
        });
      } else {
        // If POC doesn't exist in the current VisitLog, add it as a new POC
        visitLog.visitedPoc.push({
          pocId: poc._id,
          visitCount: 1,
          visits: [
            {
              mobileTime: pocDetails.mobileTime,
              remark: pocDetails.remarks || "",
              timestamp: new Date().toISOString(),
              latitude: pocDetails.latitude || 0,
              longitude: pocDetails.longitude || 0,
            },
          ],
        });
      }
    }

    // Save the updated VisitLog
    await visitLog.save();

    res.status(201).json({
      success: true,
      message: "POC created (or found) and VisitLog updated successfully",
      poc,
      visitLog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
//followup visit
const followUpVisit = async (req, res) => {
  try {
    const { pocId, createdById } = req.body;

    // Fetch the VisitLog record for the createdById employee
    let visitRecord = await VisitLog.findOne({ _id: createdById });

    if (!visitRecord) {
      // Create a new VisitLog for the employee if it doesn't exist
      visitRecord = new VisitLog({
        _id: createdById,
        visitedPoc: [
          {
            pocId: pocId,
            visitCount: 1, // First visit for this POC
            visits: [
              {
                mobileTime: pocDetails.mobileTime,
                remark: pocDetails.remarks || "",
                timestamp: new Date().toISOString(),
                latitude: pocDetails.latitude || 0,
                longitude: pocDetails.longitude || 0,
              },
            ],
          },
        ],
      });
    }

    // Check if the POC already exists in the visitedPoc array
    const pocIndex = visitRecord.visitedPoc.findIndex(
      (poc) => poc.pocId === pocId
    );

    if (pocIndex !== -1) {
      // Update the POC with follow-up details
      visitRecord.visitedPoc[pocIndex].visitCount += 1;
      visitRecord.visitedPoc[pocIndex].visits.push({
        mobileTime: req.body.mobileTime || "",
        remark: req.body.remarks || "Follow-up visit",
        timestamp: new Date().toISOString(),
        latitude: req.body.latitude || 0,
        longitude: req.body.longitude || 0,
      });
    } else {
      return res.status(404).json({
        success: false,
        message: "POC not found in the visit record",
      });
    }

    // Save the updated visit record
    await visitRecord.save();

    res.status(200).json({
      success: true,
      message: "Follow-up visit added successfully",
      visitRecord,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const getVisitLog = async (req, res) => {
  try {
    const { employeeId, pocId } = req.params;

    const visitLog = await VisitLog.findOne({
      employee: employeeId,
      poc: pocId,
    })
      .populate("employee", "fullName email role number department")
      .populate(
        "poc",
        "name age number country region city address category specialization organization latitude longitude remarks"
      );

    if (!visitLog) {
      return res
        .status(404)
        .json({ success: false, message: "VisitLog not found" });
    }

    res.status(200).json({ success: true, visitLog });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updatePocStatus = async (req, res) => {
  try {
    const { pocId, employeeId, latitude, longitude, mobileTime, remark } =
      req.body;

    const visit = await VisitLog.findOne({ _id: employeeId, poc: pocId });
    if (!visit) {
      return res
        .status(404)
        .json({ success: false, message: "VisitLog not found" });
    }

    // Add the remark
    visit.remarks.push({
      visitType: "Follow-up VisitLog",
      isVisited: true,
      visitCreationDate: Date.now(),
      latitude,
      longitude,
      mobileTime,
      remark,
    });

    visit.visitCount += 1; // Increment visit count
    await visit.save();

    res
      .status(200)
      .json({ success: true, message: "VisitLog updated", visitLog: visit });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = {
  postNewVisitLog,
  followUpVisit,
  getVisitLog,
  updatePocStatus,
};
