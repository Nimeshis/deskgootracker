import POC from "../models/pocModel";

// GET all POC id and address only
const getPOCIdName = async (req, res) => {
  try {
    const pocs = await find({}, "_id address name deleted ");
    if (!pocs) return res.status(404).json({ message: "No POCs found" });
    res.json(pocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET a single POC by id
const getPOCById = async (req, res) => {
  try {
    const poc = await findById(req.params.id);
    if (!poc) return res.status(404).json({ message: "POC not found" });
    res.json(poc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new POC
const postPOC = async (req, res) => {
  try {
    const existingPOC = await findOne({ number: req.body.number });
    if (existingPOC)
      return res.status(400).json({ message: "POC already exists" });

    const poc = new POC(req.body); // No need to manually set 'deleted' here
    await poc.save();
    res.status(201).json(poc);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// UPDATE a POC by id
const putPOCById = async (req, res) => {
  try {
    const updatedPOC = await findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!updatedPOC) return res.status(404).json({ message: "POC not found" });
    res.json(updatedPOC);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export default { postPOC, getPOCIdName, getPOCById, putPOCById };
