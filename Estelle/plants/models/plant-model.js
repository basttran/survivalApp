const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// create the Book schema using the Mongoose "Schema" class
const plantSchema = new Schema(
  {
    // document structure & rules defined here
    title: { type: String, required: true },
    author: { type: String, required: true },
    rating: { type: Number, min: 0, max: 10 },
    description: { type: String, required: true, minlength: 8 },
    reviews: [
      {
        userFullName: { type: String, default: "Anonymous" },
        reviewText: { type: String, required: true, maxlength: 200 }
      }
    ]
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
