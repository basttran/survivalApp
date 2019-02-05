const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// functions including defence against insects, fungi, diseases, and herbivorous mammals

const plantSchema = new Schema({
  name: { type: String, required: true, unique: true },
  scientificName: { type: String },
  aliases: { type: String },
  description: { type: String, minlength: 30 },
  botaniqueClass: { type: String },
  image: { type: String, match: /^https?:\/\/www.example.com/ },
  applications: ["Medicine", "Hygiene", "Food"],
  // history: { type: String, maxlength: 200 },
  /*Phytochemical basis
Further information: Phytochemistry
All plants produce chemical compounds which give them an evolutionary advantage, 
such as defending against herbivores or, in the example of salicylic acid, 
as a hormone in plant defenses.[43][44] These phytochemicals have potential for use as drugs, 
and the content and known pharmacological activity of these substances in medicinal plants 
is the scientific basis for their use in modern medicine, if scientifically confirmed. 
For instance, daffodils (Narcissus) contain nine groups of alkaloids including galantamine, 
licensed for use against Alzheimer's disease. The alkaloids are bitter-tasting and toxic, 
and concentrated in the parts of the plant such as the stem most likely to be eaten 
by herbivores; they may also protect against parasites.
Modern knowledge of medicinal plants is being systematised in the Medicinal 
Plant Transcriptomics Database, which by 2011 provided a sequence reference 
for the transcriptome of some thirty species.[48] The major classes of pharmacologically 
active phytochemicals are described below, with examples of medicinal plants that contain them.*/
  internUsage: { type: String },
  externUsage: { type: String },
  // phytochemicalBasis: ["Alkaloids", "Glycosides", "Polyphenols", "Terpenes"],
  calendar: [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "May",
    "Jun",
    "Jul",
    "Aug",
    "Sep",
    "Oct",
    "Nov",
    "Dec"
  ], // [Date]
  part: {
    type: String,
    enum: ["leave", "shoot", "root", "bark", "wood", "nuts", "seed", "fruit"]
  },
  usage: { type: String, minlength: 20 }
});

const Plant = mongoose.model("Plant", plantSchema);
