const express = require("express");
const bcrypt = require("bcrypt");

const User = require("../models/user-model.js");

const router = express.Router();

router.get("/signup", (req, res, next) => {
  res.render("auth-views/signup-form.hbs");
});

router.post("/process-signup", (req, res, next) => {
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

  // encrypt the user's password before saving
  const encryptedPassword = bcrypt.hashSync(originalPassword, 10);
  User.create({ userName, email, encryptedPassword })
    .then(() => {
      // req.flash() sends a feedback message before a redirect
      // (it's defined by the "connect-flash" npm package)
      req.flash("success", "Sign up success!");
      // redirect to the HOME PAGE if the sign up worked
      res.redirect("/");
    })
    .catch(err => next(err));
});

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

module.exports = router;
