const express = require("express");

const router = express.Router();

const Plant = require("../models/plant-model.js");

router.get("/plant-add", (req, res, next) => {
  if (req.user) {
    res.render("plant-views/plant-form.hbs");
  } else {
    req.flash("error", "You have to be logged-in to add a plant, PUNK.");
    res.redirect("/login");
  }
});

router.post("/process-plant", (req, res, next) => {
  const { plantName, plantDescription, plantPicUrl } = req.body;

  // req.user comes from Passport's deserializeUser()
  // (it's the document from the database of the logged-in user)
  const host = req.user._id;

  Plant.create({ plantName, plantDescription, plantPicUrl, host })
    .then(() => {
      req.flash("success", "Plant created successfully!");
      res.redirect("/plant");
    })
    .catch(err => next(err));
});

router.get("/plant", (req, res, next) => {
  // req.user comes from Passport's deserializeUser()
  // (it's the document from the database of the logged-in user)
  if (!req.user) {
    // AUTHORIZATION: redirect to login if you are NOT logged-in
    req.flash("error", "You must be logged-in to see your plant, PUNK");
    res.redirect("/login");
    // use return to STOP the function here if you are NOT logged-in
    return;
  }
  // filter the plants owned by the logged-in user
  Plant.find({ host: { $eq: req.user._id } })
    // sort by newest first
    .sort({ createdAt: -1 })
    // first 10 results
    .limit(10)
    .then(plantResults => {
      res.locals.plantArrray = plantResults;
      res.render("plant-views/plant-list.hbs");
    })
    .catch(err => next(err));
});

// ADMINS ONLY: list all the plants
router.get("/admin/plants", (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    // AUTHORIZATION: redirect to home page if you are NOT an ADMIN
    // (also if you are NOT logged-in)
    req.flash("error", "Only admins can do that, PUNK.");
    res.redirect("/");
    return;
  }

  Plant.find()
    .sort({ createdAt: 1 })
    .then(plantResults => {
      res.locals.plantArray = plantResults;
      res.render("plant-views/admin-plants.hbs");
    })
    .catch(err => next(err));
});

module.exports = router;
