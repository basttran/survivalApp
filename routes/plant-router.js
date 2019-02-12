const express = require("express");

const Plant = require("../models/plant-model.js");
const fileUploader = require("../config/file-upload.js");

const router = express.Router();

router.get("/plant-add", (req, res, next) => {
  if (req.user) {
    res.render("plant-views/plant-form.hbs");
  } else {
    req.flash("error", "You have to be logged-in to add a plant, PUNK.");
    res.redirect("/login");
  }
});

router.post(
  "/process-plant",
  fileUploader.single("pictureUpload"),
  (req, res, next) => {
    const { plantName, plantDescription, plantSpecies } = req.body;

    // req.user comes from Passport's deserializeUser()
    // (it's the document from the database of the logged-in user)
    const host = req.user._id;

    // multer puts all file info it got from the service into req.file
    console.log("File upload is ALWAYS in req.file OR req.files", req.file);

    // get part of the Cloudinary information
    const plantPicUrl = req.file.secure_url;

    Plant.create({
      plantName,
      plantDescription,
      plantSpecies,
      plantPicUrl,
      host
    })
      .then(() => {
        req.flash("success", "Plant created successfully!");
        res.redirect("/my-plants");
      })
      .catch(err => next(err));
  }
);

// delete a plant
router.get("/my-plants/:plantId/delete", (req, res, next) => {
  // res.json(req.body);
  const { plantId } = req.params;

  Plant.findByIdAndRemove(plantId)
    .then(plantDoc => {
      res.redirect("/my-plants");
    })
    // next(err) skips to the error handler in "bin/www" (error.hbs)
    .catch(err => next(err));
});

// router.get("/book/:bookId/delete", (req, res, next) => {
//   // res.json(req.body);
//   const { bookId } = req.params;

//   Book.findByIdAndRemove(bookId)
//     .then(bookDoc => {
//       res.redirect("/books");
//     })
//     // next(err) skips to the error handler in "bin/www" (error.hbs)
//     .catch(err => next(err));
// });

router.get("/my-plants", (req, res, next) => {
  // req.user comes from Passport's deserializeUser()
  // (it's the document from the database of the logged-in user)
  if (!req.user) {
    // AUTHORIZATION: redirect to login if you are NOT logged-in
    req.flash("error", "You must be logged-in to see your plants, PUNK");
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
      // res.json(plantResults);
      res.locals.plantArray = plantResults;
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
      res.render("plant-views/plant-list.hbs");
    })
    .catch(err => next(err));
});

module.exports = router;
