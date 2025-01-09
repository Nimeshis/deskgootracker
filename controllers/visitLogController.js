const VisitLog = require("../models/visitLogModel");
const POC = require("../models/pocModel");

const postNewVisitLog = async (req, res) => {
  try {
    const { number, createdById, ...pocDetails } = req.body;

    // Check if POC already exists
    const existingPOC = await POC.findOne({ number: req.body.number });
    if (existingPOC) {
      return res
        .status(400)
        .json({ success: false, message: "POC already exists" });
    }

    // Create new POC
    const poc = new POC({ number, createdById, ...pocDetails });
    await poc.save();

    // Create a new VisitLog
    const visitLog = await VisitLog.create({
      _id: poc.createdById,
      visitLog: [
        {
          visitCreationDate: Date.now(),
          poc: [
            {
              pocId: poc._id,
              visitType: "New VisitLog",
              isVisited: false,
              visitCreationDate: Date.now(),
            },
          ],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "POC created and VisitLog updated",
      poc,
      visitLog,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const followUpVisit = async (req, res) => {
  try {
    const { pocId, employeeId } = req.body;

    const existingVisit = await VisitLog.findOne({
      poc: pocId,
      _id: employeeId,
    });
    if (!existingVisit) {
      return res
        .status(404)
        .json({ success: false, message: "VisitLog not found" });
    }

    // Add follow-up visit remark
    const visitLog = await VisitLog.push({
      visitLog: [
        {
          poc: [
            {
              visitType: "follow up VisitLog",
              isVisited: false,
              visitCreationDate: Date.now(),
            },
          ],
        },
      ],
    });
    await visitLog.save();

    res.status(200).json({
      success: true,
      message: "Follow-up visit added",
      visitLog: existingVisit,
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
