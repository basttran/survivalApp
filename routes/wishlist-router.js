const express = require("express");

const router = express.Router();

const Species = require("../models/species-model.js");

router.get("/wishlist", (req, res, next) => {
  res.render("auth-views/wishlist.hbs");
});

router.get("/wishlist/:speciesId/add", (req, res, next) => {
  // on ajoute la plante dont l'id est :speciesId à la wishlist
  const { speciesId } = req.params;
  Species.findById(speciesId)
    .then(species => {
      req.user.species.push(species); // we need to actually push to the userDoc
      // console.log(req.user);
    })
    .catch(err => next(err));

  // puis redirection vers la page /wishlist
  req.flash("success", "Add to wishlist successfully!");
  res.redirect("/wishlist");
});

module.exports = router;
