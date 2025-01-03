const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const countryDataSchema = new Schema({
  countryData: [
    {
      country: { type: String, required: true },
      area: [
        {
          areaName: { type: String, required: true },
          cities: [{ type: String }], // Array of city names
        },
      ],
    },
  ],
});

module.exports = mongoose.model("CountryData", countryDataSchema);
