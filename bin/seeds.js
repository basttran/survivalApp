// Seed File (run this to insert more Celebs into the database)
// -----------------------------------
// connects seed.js to the .env file
require("dotenv").config();

const mongoose = require("mongoose");

// Get the Celebrity model to do our databse query
const User = require("../models/user-model.js");

const userData = require("./users.json");

const Plant = require("../models/plant-model.js");

const plantData = require("./plants.json");

// !!! CONNECT TO THE SAME DATABASE AS app.js !!!
// connects to MongoDB server with the DB name equal to the project name
// (also has console.logs for successful and failed connections)
mongoose
  .connect("mongodb://localhost/survivalApp", { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

User.create(userData)
  .then(userResults => {
    console.log(`Inserted ${userResults.length} USERS!`);
  })
  .catch(err => {
    console.log("Insert USERS FAILURE!!", err);
  });

Plant.create(plantData)
  .then(plantResults => {
    console.log(`Inserted ${plantResults.length} PLANTS!`);
  })
  .catch(err => {
    console.log("Insert PLANTS FAILURE!!", err);
  });
