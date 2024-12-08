const express = require("express");
const router = express.Router();
const CountryData = require("../models/countryModel");

//get all list of countries
// Get all country data
router.get("/country", async (req, res) => {
  try {
    const data = await CountryData.find();

    if (!data || data.length === 0) {
      return res.status(404).json({ message: "No country data found" });
    }

    // Extract the list of countries
    const countryList = data
      .map((entry) => entry.countryData[0]?.country)
      .filter(Boolean);

    res.json(countryList);
  } catch (err) {
    res.status(500).json({ message: `Error retrieving data: ${err.message}` });
  }
});

// Route 2: Fetch regions and cities for a specific country
router.get("/country/:countryName", async (req, res) => {
  const { countryName } = req.params;

  try {
    const data = await CountryData.findOne({
      "countryData.country": countryName,
    });

    if (!data) {
      return res
        .status(404)
        .json({ message: `No data found for country: ${countryName}` });
    }

    const countryEntry = data.countryData.find(
      (entry) => entry.country === countryName
    );

    if (!countryEntry) {
      return res
        .status(404)
        .json({ message: `No data found for country: ${countryName}` });
    }

    const sortedRegions = countryEntry.regions
      .map((region) => ({
        regionName: region.regionName,
        cities: region.cities.sort(),
      }))
      .sort((a, b) => a.regionName.localeCompare(b.regionName));

    res.json((regions = sortedRegions));
  } catch (err) {
    res.status(500).json({
      message: `Error retrieving data for ${countryName}: ${err.message}`,
    });
  }
});

router.post("/country", async (req, res) => {
  const { countryData } = req.body;

  try {
    for (const countryEntry of countryData) {
      const { country, regions } = countryEntry;

      //check if country existss
      const existingCountry = await CountryData.findOne({
        "countryData.country": country,
      });

      if (existingCountry) {
        for (const region of regions) {
          const existingRegion = existingCountry.countryData
            .find((entry) => entry.country === country)
            .regions.find((r) => r.regionName === region.regionName);

          if (existingRegion) {
            region.cities.forEach((city) => {
              if (!existingRegion.cities.includes(city)) {
                existingRegion.cities.push(city);
              }
            });
            existingRegion.cities.sort();
          } else {
            existingCountry.countryData
              .find((entry) => entry.country === country)
              .regions.push({
                regionName: region.regionName,
                cities: region.cities.sort(),
              });
          }
        }

        await existingCountry.save();
      } else {
        const newCountry = new CountryData({
          countryData: [
            {
              country,
              regions: regions.map((region) => ({
                regionName: region.regionName,
                cities: region.cities.sort(),
              })),
            },
          ],
        });
        await newCountry.save();
      }
    }

    res
      .status(201)
      .json({ message: "Country data saved/updated successfully!" });
  } catch (err) {
    res
      .status(500)
      .json({ message: `Error saving/updating data: ${err.message}` });
  }
});

module.exports = router;
