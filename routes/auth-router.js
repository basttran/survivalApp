const express = require("express");
const bcrypt = require("bcrypt");

const fileUploader = require("../config/file-upload.js");

const User = require("../models/user-model.js");
const Plant = require("../models/plant-model.js");
const Species = require("../models/species-model.js");

const router = express.Router();

router.get("/user-edit", (req, res, next) => {
  // get the ID from the address (it's inside of req.params)
  const { userId } = req.user._id;

  // find the plant in the DB using the ID from the address
  User.findById(userId)
    .then(userDoc => {
      // send the database query result to the HBS file as "plantItem"
      res.locals.userItem = userDoc;
      res.render("auth-views/user-edit.hbs");
    })
    // next(err) skips to the error handler in "bin/www" (error.hbs)
    .catch(err => next(err));
});

router.get("/profile", (req, res, next) => {
  // whenever a user visits "/books"find all the books sorted by rating
  console.log("COUCOU");
  Plant.find({ host: { $eq: req.user._id } }) //req.user._id}})
    .sort()
    .then(plantResults => {
      // send the database query results to the HBS file as "bookArray"
      res.locals.plantArray = plantResults;
      let indicesArray = plantResults.map((onePlant, index) => {
        if (index == 0) {
          return (
            `<li data-target="#carouselExampleIndicators" data-slide-to="` +
            index +
            `" class="active"></li>`
          );
        } else {
          return (
            `<li data-target="#carouselExampleIndicators" data-slide-to="` +
            index +
            `"></li>`
          );
        }
      });
      res.locals.plantIndices = indicesArray;

      Species.find()
        .sort({ grade: 1 })
        .then(speciesResults => {
          // send the database query results to the HBS file as "bookArray"
          res.locals.speciesArray = speciesResults; // for now we only display all the species in the DB
          res.render("auth-views/user-profile.hbs");
        })
        // next(err) skips to the error handler in "bin/www" (error.hbs)
        .catch(err => next(err));
      // res.json(res.locals.plantArray);
    })
    // next(err) skips to the error handler in "bin/www" (error.hbs)
    .catch(err => next(err));
});

// update the profile
router.post(
  "/profile-edit",
  fileUploader.single("profilePicUrl"),
  (req, res, next) => {
    // res.json(req.body);
    // const { userId } = req.user._id
    const { userName, email } = req.body;
    console.log("File upload is ALWAYS in req.file OR req.files", req.file);
    // console.log(userId);
    // console.log(email);

    var changes = {
      userName,
      email
    };

    let picture;
    if (req.file) {
      picture = req.file.secure_url;
      changes.profilePicUrl = picture;
    }

    User.findByIdAndUpdate(
      req.user._id, // ID of the document we want to update
      {
        $set: changes
      }, // changes to make to that document
      { runValidators: true } // additional settings (enforce the rules)
    )
      .then(userDoc => {
        // ALWAYS redirect if it's successful to avoid DUPLICATE DATE on refresh
        // redirect ONLY to ADDRESSES - not HBS files
        res.redirect("/profile");
      })
      // next(err) skips to the error handler in "bin/www" (error.hbs)
      .catch(err => next(err));
  }
);

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post(
  "/process-signup",
  fileUploader.single("profilePicUrl"),
  (req, res, next) => {
    const { userName, email, originalPassword } = req.body;

    // enforce password rules (can't be EMPTY and MUST have a digit)
    if (!originalPassword || !originalPassword.match(/[0-9]/)) {
      // req.flash() sends a feedback message before a redirect
      // (it's defined by the "connect-flash" npm package
      req.flash("error", "Password can't be blank and must contain a number.");
      // redirect to the SIGNUP PAGE if the password is BAD
      res.redirect("/signup");
      return;
    }

    // multer puts all file info it got from the service into req.file
    console.log("File upload is ALWAYS in req.file OR req.files", req.file);
    // get part of the Cloudinary information
    const profilePicUrl = req.file.secure_url;

    // encrypt the user's password before saving
    const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
    User.create({ userName, profilePicUrl, email, encryptedPassword })
      .then(() => {
        // req.flash() sends a feedback message before a redirect
        // (it's defined by the "connect-flash" npm package)
        req.flash("success", "Sign up success!");
        // redirect to the HOME PAGE if the sign up worked
        res.redirect("/");
      })
      .catch(err => next(err));
  }
);

router.get("/login", (req, res, next) => {
  res.render("auth-views/login-form.hbs");
});

router.post("/process-login", (req, res, next) => {
  const { email, originalPassword } = req.body;

  // validate the email by searching the database for an account with that email
  User.findOne({ email: { $eq: email } })
    .then(userDoc => {
      if (!userDoc) {
        // req.flash() sends a feedback message before a redirect
        // (it's defined bt the "connect-flash" npm package)
        req.flash("error", "Email is incorrect.");
        // redirect to LOGIN PAGE if result is NULL (no account with the email)
        res.redirect("/login");
        // use return to STOP the function here if the email is BAD
        return;
      }

      // validate the password by using bcrypt.comparSync()
      const { encryptedPassword } = userDoc;

      if (!bcrypt.compareSync(originalPassword, encryptedPassword)) {
        req.flash("error", "Password is incorrect.");
        // redirect to LOGIN PAGE if the passwords don't match
        res.redirect("/login");
        // use return to STOP the function here if the PASSWORD is BAD
        return;
      }
      // email & password are CORRECT!
      // if we MANUALLY managed the user session:
      // req.session.userId = userDoc._id;

      // instead we will use PASSPORT - an npm package for managing user sessions
      // req.login() is a Passport method that calls serialize*user()
      // (that saves the USER ID in the session which means we are logged-in)
      req.logIn(userDoc, () => {
        // req.flash() sends a feedback message before a redirect
        // (it's defined by the "connect-flash" npm package)
        req.flash("success", "Log in success!");
        res.redirect("/profile"); // check this redirect, it should eventually lead to the user's page (default is "/")
      });
    })
    .catch(err => next(err));
});

router.get("/logout", (req, res, next) => {
  // req.logOut(); is a Passport method that removes the USER ID from the session
  req.logOut();

  req.flash("success", "Logged out successfully!");
  res.redirect("/");
});

router.get("/contact", (req, res, next) => {
  res.render("extra-resources/contact.hbs");
});

router.get("/sources", (req, res, next) => {
  res.render("extra-resources/sources.hbs");
});

router.get("/passwordforgotten", (req, res, next) => {
  res.render("extra-resources/passwordforgotten.hbs");
});

// /passwordforgotten-email

router.get("/profile", (req, res, next) => {
  req.flash("success");
  res.redirect("/user-model.js"); // Strange ~^
});

module.exports = router;
