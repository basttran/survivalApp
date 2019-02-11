import { WSAEDESTADDRREQ } from "constants";
import { CLIENT_RENEG_LIMIT } from "tls";

const plantSchema = new Schema({


  // The taxonomic data are easily scraped and may prove helpful for the user to deepen is research with other resources
  species: { type: String, required: true, unique: true }, // Binom latin.
  aliases: { type: [String]}, // Other names
  // division: {type: String},
  // class: {type: String},
  // subclass: {type: String},
  // order: {type: String},
  // family: {type: String},
  // genus: {type: String},
  // 
  // distribution: {type: Image || Link || Matrix || Zipcode}, // See about that later, but maps can be found, ideally we could get GIS data and do whatever we want
  // wether or not the plant has an application in a given domain
  medecine: {type: Boolean}, 
  hygiene: { type: Boolean},  
  food:  { type: Boolean}, 
  medicalApplication: {type: [Object]}, // medical applications
  hygieneApplication: {type: [Object]}, // body cleaning/washing applications
  foodApplication: {type: [Object]}, // alimentary applications
  caution: {type: [String]} // general precautions if relevant
});

const commentSchema = new Schema({
  parent:  {type: [Object]},
  poster:  {type: [Object]},
  plant: {type: String},
  part: {type: String, enum: ["leave","shoot","root","bark","wood","nuts","seed","fruit"]},
  purpose: { type: String},
  procedure: {type: String},
},
{
  timestamps: true
});

const userSchema = new Schema({
  username: {type: String},
  mail: {type: String},
  password: { type: String},
  plants: {type: [Object]},
  follows: { type: [Object]},
  comments: { type: [Object]},
  likes: { type: [Object]}
},
{
  timestamps: true
});


[{
  username: "NancyB",
  mail: "flower@weeds.net",
  password: "pot",
  plants: {type: [Object]},
  follows: { type: [Object]},
  comments: { type: [Object]},
  likes: { type: [Object]}
},
{
  username: "Cooper",
  mail: "pop@interstellar.com",
  password: "corn",
  plants: {type: [Object]},
  follows: { type: [Object]},
  comments: { type: [Object]},
  likes: { type: [Object]}
},
{
  username: "PoisonIvy",
  mail: "nettles@gotham.org",
  password: "ortie",
  plants: {type: [Object]},
  follows: { type: [Object]},
  comments: { type: [Object]},
  likes: { type: [Object]}
},
{
  username: "beanstalk",
  mail: "jack@skyisthelimit.io",
  password: "haricot",
  plants: {type: [Object]},
  follows: { type: [Object]},
  comments: { type: [Object]},
  likes: { type: [Object]}
},
{
  username: "demeter",
  mail: "diane@pantheon.biz",
  password: "wild",
  plants: {type: [Object]},
  follows: { type: [Object]},
  comments: { type: [Object]},
  likes: { type: [Object]}
},]

[{
  username: "NancyB",
  mail: "flower@weeds.net",
  password: "pot",
  plants: []
},
{
  username: "Cooper",
  mail: "pop@interstellar.com",
  password: "corn",
  plants: []
},
{
  username: "PoisonIvy",
  mail: "nettles@gotham.org",
  password: "ortie",
  plants: []
},
{
  username: "beanstalk",
  mail: "jack@skyisthelimit.io",
  password: "haricot",
  plants: []
},
{
  username: "demeter",
  mail: "diane@pantheon.biz",
  password: "wild",
  plants: []
},]




  // level: {
  //   type: String,
  //   enum: ["Easy Peasy", "Amateur Chef", "UltraPro Chef"]
  // }, // Type String. Only can be one of the following values: Easy Peasy - Amateur Chef - UltraPro Chef (remember the ENUM wink)
  // ingredients: { type: [String] },
  // cuisine: { type: String, required: true }, // Type String. Should be required.
  // dishType: {
  //   type: String,
  //   enum: ["Breakfast", "Dish", "Snack", "Drink", "Dessert", "Other"]
  // }, // Type String. Possible values: Breakfast - Dish - Snack - Drink - Dessert - Other.
  // image: {
  //   type: String,
  //   default: "https://images.media-allrecipes.com/images/75131.jpg",
  //   match: /^https?:\/\//
  // }, // Type String. Default value: https://images.media-allrecipes.com/images/75131.jpg.
  // duration: { type: Number, min: 0 }, // Type Number. Min value should be 0.
  // creator: { type: String }, // Type String
  // created: { type: Date, default: new Date() } // Type Date. By default today.
