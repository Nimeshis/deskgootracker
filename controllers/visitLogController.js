const VisitLog = require("../models/visitLogModel");
// Log a new visit for a specific employee and POC
const postVisitLog = async (req, res, next) => {
  try {
    const { employeeId, pocId, mobileTime, latitude, longitude, remarks } =
      req.body;

    // Check if the visit log for the same employee and POC already exists
    let existingVisit = await findOne({
      employee: employeeId,
      poc: pocId,
    });

    if (existingVisit) {
      // If the visit log exists, update the visitCount and set the new visit details
      existingVisit.visitCount += 1; // Increase the visit count
      existingVisit.visitDate = Date.now();
      existingVisit.mobileTime = mobileTime;
      existingVisit.submissionLocation = { latitude, longitude };
      existingVisit.remarks = remarks;

      await existingVisit.save();
      return res.status(200).json({
        message: "Visit logged successfully, visit count updated.",
        visit: existingVisit,
      });
    } else {
      // If no previous visit log, create a new visit log fot the poc visited bt employee
      const newVisit = new VisitLog({
        employee: employeeId,
        poc: pocId,
        mobileTime: mobileTime,
        submissionLocation: { latitude, longitude },
        remarks,
        visitCount: 1,
      });

      await newVisit.save();

      return res.status(201).json({
        message: "New visit logged successfully.",
        visit: newVisit,
      });
    }
  } catch (error) {
    console.error("Error logging visit:", error);
    return res
      .status(500)
      .json({ message: "Server error while logging visit." });
  }
};

// Get the visit log for a specific employee and POC, including full details
const getVisitLog = async (req, res) => {
  try {
    const { employeeId, pocId } = req.params;
    // Fetch the visit log and populate the related employee and POC data
    const visitLog = await VisitLog.findOne({
      employee: employeeId,
      poc: pocId,
    })
      .populate("employee", "fullName email role number department") // Populate employee fields
      .populate(
        "poc",
        "name age number country region city address category specialization organization latitude longitude remarks"
      ); // Populate POC fields

    if (!visitLog) {
      return res
        .status(404)
        .json({ message: "Visit log not found for this employee and POC." });
    }

    return res.status(200).json({
      message: "Visit log retrieved successfully.",
      visitLog: visitLog,
    });
  } catch (error) {
    console.error("Error retrieving visit log:", error);
    return res
      .status(500)
      .json({ message: "Server error while retrieving visit log." });
  }
};
module.exports = {
  postVisitLog,
  getVisitLog,
};
