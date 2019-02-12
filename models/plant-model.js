const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const plantSchema = new Schema(
  {
    plantName: { type: String },
    plantDescription: { type: String },
    plantSpecies: { type: String },
    plantPicUrl: { type: String, required: true, match: /^https?:\/\// },
    host: { type: String }
  },
  {
    timestamps: true
  }
);

// "User" model -> "users" collection

const Plant = mongoose.model("Plant", plantSchema);

module.exports = Plant;
