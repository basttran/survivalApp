router.get("/search-result-drink", (req, res, next) => {
  const { search_query } = req.query;

  var drinks = [];

  User.findById(req.user._id).then(userDoc => {
    const userCocktails = userDoc.cocktailCreated;
    console.log(userDoc);
    userCocktails.forEach(drink => {
      drinks.push(drink);
    });
  });

  Cocktail.find({ strDrink: { $regex: search_query, $options: "i" } })
    .then(drinkResults => {
      drinkResults.forEach(drink => {
        drinks.push(drink);
      });
      if (!drinkResults) {
        res.render("search-views/search.hbs");
      } else {
        res.locals.drinkArray = drinks;
        res.render("search-views/search-result-drink.hbs");
      }
    })
    .catch(err => next(err));
});
