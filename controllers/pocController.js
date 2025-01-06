const POC = require("../models/pocModel");
//get all the pocs id name and their address
const getPOCIdName = async (req, res) => {
  try {
    const pocs = await POC.find({});

    if (!pocs || pocs.length === 0) {
      return res.status(404).json({ message: "No POCs found" });
    }

    const result = pocs.map((poc) => {
      // console.log(`${poc.country}, `);
      // console.log(
      //   `Country: ${poc.country}, Region: ${poc.region}, City: ${poc.city}, Address: ${poc.address}`
      // );
      //combined address fields
      const fullAddress = `${poc.country}, ${poc.region}, ${poc.city} ,${poc.address}`;
      console.log(fullAddress);
      return {
        id: poc._id,
        fullName: poc.name,
        address: fullAddress,
        latitude: poc.latitude,
        longitude: poc.longitude,
        deleted: poc.deleted,
      };
    });

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET POC by ID
const getPOCById = async (req, res) => {
  const { id } = req.params;
  try {
    const poc = await POC.findById(id);
    if (!poc) {
      return res.status(404).json({ message: "POC not found" });
    }

    const pocs = {
      fullName: poc.name,
      age: poc.age,
      number: poc.number,
      fullAddress: `${poc.country}, ${poc.region}, ${poc.city}, ${poc.address}`,
      specialization: poc.specialization,
      organization: poc.organization,
      latitude: poc.latitude,
      longitude: poc.longitude,
      deleted: poc.deleted,
      mobileTime: poc.mobileTime,
      remarks: poc.remarks,
    };

    res.json(pocs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// POST a new POC
const postPOC = async (req, res) => {
  try {
    // console.log(req.body);
    const existingPOC = await POC.findOne({ number: req.body.number });
    if (existingPOC)
      return res.status(400).json({ message: "POC already exists" });

    const poc = new POC(req.body);
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

module.exports = { postPOC, getPOCIdName, getPOCById, putPOCById };
