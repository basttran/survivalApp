const express = require("express");

const Specimen = require("../models/specimen-model.js");
const fileUploader = require("../config/file-upload.js");

const router = express.Router();


router.get("/specimen-add", (req, res, next) => {
  if (req.user) {
    res.render("specimen-views/specimen-form.hbs");
  } else {
    req.flash("error", "You have to be logged-in to add a specimen, PUNK.");
    res.redirect("/login");
  }
});

router.post("/process-specimen", fileUploader.single("pictureUpload"), (req, res, next) => {
  const { specimenName, specimenDescription, specimenSpecies } = req.body;

  // req.user comes from Passport's deserializeUser()
  // (it's the document from the database of the logged-in user)
  const host = req.user._id;

      // multer puts all file info it got from the service into req.file
      console.log("File upload is ALWAYS in req.file OR req.files", req.file);

      // get part of the Cloudinary information
      const specimenPicUrl = req.file.secure_url;
  

  Specimen.create({ specimenName, specimenDescription, specimenSpecies, specimenPicUrl, host })
    .then(() => {
      req.flash("success", "Specimen created successfully!");
      res.redirect("/my-specimens");
    })
    .catch(err => next(err));
});

router.get("/my-specimens", (req, res, next) => {
  // req.user comes from Passport's deserializeUser()
  // (it's the document from the database of the logged-in user)
  if (!req.user) {
    // AUTHORIZATION: redirect to login if you are NOT logged-in
    req.flash("error", "You must be logged-in to see your specimens, PUNK");
    res.redirect("/login");
    // use return to STOP the function here if you are NOT logged-in
    return;
  }
  // filter the specimens owned by the logged-in user
  Specimen.find({ host: { $eq: req.user._id } })
    // sort by newest first
    .sort({ createdAt: -1 })
    // first 10 results
    .limit(10)
    .then(specimenResults => {
      // res.json(specimenResults);
      res.locals.specimenArray = specimenResults;
      res.render("specimen-views/specimen-list.hbs");
    })
    .catch(err => next(err));
});

// ADMINS ONLY: list all the specimens
router.get("/admin/specimens", (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    // AUTHORIZATION: redirect to home page if you are NOT an ADMIN
    // (also if you are NOT logged-in)
    req.flash("error", "Only admins can do that, PUNK.");
    res.redirect("/");
    return;
  }

  Specimen.find()
    .sort({ createdAt: 1 })
    .then(specimenResults => {
      res.locals.specimenArray = specimenResults;
      res.render("specimen-views/specimen-list.hbs");
    })
    .catch(err => next(err));
});

module.exports = router;
