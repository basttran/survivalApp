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

module.exports = router;
