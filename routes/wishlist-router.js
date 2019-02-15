const express = require("express");

const router = express.Router();

const User = require("../models/user-model.js");

const Species = require("../models/species-model.js");

router.get("/wishlist", (req, res, next) => {
  Species.find({
    _id: { $in: req.user.species }
  })
    .then(speciesResults => {
      res.locals.speciesArray = speciesResults;
      res.render("auth-views/wishlist.hbs");
    })
    .catch(err => next(err));
});

// router.get("/wishlist/:speciesId/add", (req, res, next) => {
//   // on ajoute la plante dont l'id est :speciesId à la wishlist
//   const { speciesId } = req.params;
//   Species.findById(speciesId)
//     .then(species =>
//       req.user.species.push(species); // we need to actually push to the userDoc
//       // console.log(req.user);
//     })
//     .catch(err => next(err));

//   // puis redirection vers la page /wishlist
//   req.flash("success", "Add to wishlist successfully!");
//   res.redirect("/wishlist");
// });

router.get("/wishlist/:speciesId/add", (req, res, next) => {
  // console.log("currentUser: "+res.locals.currentUser._id);
  // const { wisherId } = ;
  const { speciesId } = req.params;
  // console.log("speciesId: "+speciesId);
  // console.log("wisherId: "+wisherId);
  User.findByIdAndUpdate(
    res.locals.currentUser._id, // ID of the document we want to update
    { $push: { species: speciesId } }, // changes to the document
    { runValidators: true } // additional settings (enforce the rules)
  )
    .then(userDoc => {
      res.redirect("/wishlist");
    })
    // next(err) skips to the error handler in "bin/www"
    .catch(err => next(err));
});

module.exports = router;
