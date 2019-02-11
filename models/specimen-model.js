const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const specimenSchema = new Schema(
  {
    specimenName: { type: String },
    specimenDescription: { type: String },
    specimenSpecies: { type: String },
    host: { type: String }
  },
  {
    timestamps: true
  }
);

// "User" model -> "users" collection

const Specimen = mongoose.model("Specimen", specimenSchema);

module.exports = Specimen;
