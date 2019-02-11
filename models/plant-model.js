const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// create the Book schema using the Mongoose "Schema" class
const plantSchema = new Schema(
  {
    // document structure & rules defined here
    name: { type: String, required: true, minlength: 4 }, // "name": "Bunny Ears Cactus",
    scientificName: { type: String, required: true, minlength: 4 }, //  "scientificName": "Opuntia microdasys",
    commonNames: [{ type: String, min: 0 }, { type: String, min: 0 }], // "commonNames": ["Bunny Ears", "Bunny Ears Cactus"],
    place: {
      type: Array,
      items: {
        type: String,
        enum: ["indoor", "outdoor"]
      }
    },
    description: {
      type: String,
      required: true,
      minlength: 100,
      maxlength: 1000
    }, // "description": "Originally from Mexico, the bunny ears cactus",
    scientificClassification: [
      {
        Family: { type: String, required: true },
        Subfamily: { type: String },
        Tribe: { type: String },
        Genus: { type: String }
      }
    ], //   "scientificClassification": {"Family": "Cactaceae","Subfamily": "Opuntioidea","Tribe": "Opuntieae","Genus": "Opuntia"}
    wateringNeeds: { type: String, required: true, minlength: 4 }, //  "wateringNeeds": "every 3-4 weeks",
    sunlightNeeds: { type: String, required: true, minlength: 4 }, //  "sunlightNeeds": "partial sunlight",
    flowerColor: { type: String }, //   "flowerColor": "white",
    plantGrowsUp: [
      {
        tall: { type: String },
        wide: { type: String }
      }
    ], //   "plantGrowsUp": { "tall": "24″ (61 cm)", "wide": "5′ (1.5 m)" },
    cold: { type: String, required: true }, //     "cold": "Not cold hardy",
    propagation: { type: String, required: true, minlength: 4 }, //     "propagation": "by cuttings",
    toxicity: { type: String, required: true, minlength: 4 }, //     "toxicity": "non-toxic to humans and animals",
    activelyGrows: { type: String, required: true, minlength: 4 }, //      "activelyGrows": "Spring and Fall",
    level: {
      type: String,
      required: true,
      minlength: 4,
      enum: ["easy", "medium", "hard"]
    } //     "level": "easy"
  },
  {
    // additional settings for the Schema class here
    timestamp: true
  }
);

// use the schema to create the Plant model (it has the methods for db queries)
// "Plant" model -> "plants" ollection
const Plant = mongoose.model("Plant", plantSchema);

// share the "Plant" model with other parts of the app
module.exports = Plant;
