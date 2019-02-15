require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const express = require("express");
const favicon = require("serve-favicon");
const hbs = require("hbs");
const mongoose = require("mongoose");
const path = require("path");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo")(session);
const passport = require("passport");
// const Typeahead = require("typeahead");
const Species = require("./models/species-model.js");

// run the code inside the "passport-setup.js"
require("./config/passport-setup.js");

mongoose
  .connect(process.env.MONGODB_URI, { useNewUrlParser: true })
  .then(x => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch(err => {
    console.error("Error connecting to mongo", err);
  });

const app_name = require("./package.json").name;
const debug = require("debug")(
  `${app_name}:${path.basename(__filename).split(".")[0]}`
);

const app = express();

// Middleware Setup
app.use(logger("dev"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express View engine setup

app.use(
  require("node-sass-middleware")({
    src: path.join(__dirname, "public"),
    dest: path.join(__dirname, "public"),
    sourceMap: true
  })
);

// connect the "views/partials/" folder to the HBS for using partials
hbs.registerPartials(path.join(__dirname, "views", "partials"));

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
app.use(express.static(path.join(__dirname, "public")));
app.use(favicon(path.join(__dirname, "public", "images", "favicon.ico")));

// make our Express app create SESSIONS (more on this tomorrow)
app.use(
  session({
    // saveUninitialized & resave are just to avoid warning messages
    saveUninitialized: true,
    resave: true,
    // should be a string that's different for every app
    secret: process.env.SESSION_SECRET,
    // store our session data inside our MongoDB using "connect-mongo" package
    store: new MongoStore({ mongooseConnection: mongoose.connection })
  })
);

// set up Passport's methods to use in our routes
app.use(passport.initialize());
// make passport manage our user session
app.use(passport.session());

// allow our routes to use FLASH MESSAGES -- feedback messages before redirects
// (flash messages need sessions to work)
app.use(flash());
//app.use() defines our own MIDDLEWARE function
app.use((req, res, next) => {
  // send flash messages to the hbs file
  // (req.flash() comes from the "connect-flash" npm package)
  res.locals.messages = req.flash();
  // send the logged-in user's info to ALL hbs files
  // (req.user is defined by Passport and contains the logged-in user's info)

  res.locals.currentUser = req.user;

  // tell Express we are ready to move to the routes now
  // (you need this or your pages will stay loading forever)
  next();
});

// app.post("/search", (req, res, next) => {
//   let q = req.body.query;
//   let query = {
//     $or: [{ name: { $regex: q, $options: "i" } }]
//   };
//   let output = [];

//   Species.find({ name: { $eq: "Bunny Ears Cactus" } })
//     .limit(6)
//     .then(species => {
//       if (species && species.length && species.length > 0) {
//         species.forEach(species => {
//           let obj = {
//             id: species.name,
//             label: species.name
//           };
//           output.push(obj);
//         });
//       }
//       res.json(output);
//     })
//     .catch(err => {
//       res.sendStatus(404);
//     });
// });

// function searchBar() {
//   // Declare variables
//   var input, filter, ul, li, a, i, txtValue;
//   input = document.getElementById("myInput");
//   filter = input.value.toUpperCase();
//   ul = document.getElementById("myUL");
//   li = ul.getElementsByTagName("li");

//   // Loop through all list items, and hide those who don't match the search query
//   for (i = 0; i < li.length; i++) {
//     a = li[i].getElementsByTagName("a")[0];
//     txtValue = a.textContent || a.innerText;
//     if (txtValue.toUpperCase().indexOf(filter) > -1) {
//       li[i].style.display = "";
//     } else {
//       li[i].style.display = "none";
//     }
//   }
// }

/// TYPE AHEAD STUFF
app.post("/search", (req, res) => {
  let q = req.body.query;
  let query = { name: { $regex: q, $options: "i" } };
  let output = [];

  Species.find(query)
    .limit(6)
    .then(sp => {
      if (sp && sp.length && sp.length > 0) {
        sp.forEach(species => {
          let obj = {
            id: species.name,
            label: species.name
          };
          output.push(obj);
        });
      }
      res.json(output);
    })
    .catch(err => {
      res.sendStatus(404);
    });
});
/// TYPE AHEAD STUFF

// default value for title local
app.locals.title = "DAT.plant";

const index = require("./routes/index");
app.use("/", index);

const auth = require("./routes/auth-router.js");
app.use("/", auth);

const plant = require("./routes/plant-router.js");
app.use("/", plant);

const species = require("./routes/species-router.js");
app.use("/", species);

const wishlist = require("./routes/wishlist-router.js");
app.use("/", wishlist);

module.exports = app;
