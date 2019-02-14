const express = require("express");

const router = express.Router();

const Species = require("../models/species-model.js");

router.get("/species", (req, res, next) => {
  // req.user comes from Passport's deserializeUser()
  // (it's the document from the database of the logged-in user)
  // if (!req.user) {
  //   // AUTHORIZATION: redirect to login if you are NOT logged-in
  //   req.flash("error", "You must be logged-in to see your plants, PUNK");
  //   res.redirect("/login");
  //   // use return to STOP the function here if you are NOT logged-in
  //   return;
  // }
  // filter the plants owned by the logged-in user
  Species.find()
    // sort by newest first
    .sort({ level: -1 })
    // first 10 results
    // .limit(10)
    .then(speciesResults => {
      // res.json(speciesResults);
      res.locals.speciesArray = speciesResults;
      res.render("species-views/species-list.hbs");
    })
    .catch(err => next(err));
});

router.get("/search-species", (req, res, next) => {
  const { search_query } = req.query;
  console.log(search_query);
  var speciesList = [];

  Species.find({ name: { $eq: search_query } })
    .then(speciesResults => {
      speciesResults.forEach(species => {
        speciesList.push(species);
      });
      console.log(speciesResults);
      if (!speciesResults) {
        res.render("species-views/species-list.hbs");
      } else {
        res.locals.speciesArray = speciesList;
        res.render("species-views/species-list.hbs");
      }
    })
    .catch(err => next(err));
});

router.get("/species/:speciesId", (req, res, next) => {
  // res.send(req.params);
  const { speciesId } = req.params;

  // find the species in the database using the ID from the address
  Species.findById(speciesId)
    .then(speciesDoc => {
      // send the database query results to the HBS file as "speciesItem"
      res.locals.speciesItem = speciesDoc;
      res.render("species-views/species-details.hbs");
    })
    //
    .catch(err => next(err));
});

module.exports = router;
