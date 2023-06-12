const express = require("express"); // help build out API
const app = express();
const mongoose = require("mongoose"); // talk to mongoDB database
const passport = require("passport"); // authentication for Login
const session = require("express-session"); // so users can stay logged in as they move across application
const MongoStore = require("connect-mongo")(session); // storing the actual session in the MongoDB to stay logged in
const methodOverride = require("method-override"); // allows us to use DELETE/PUT/GET/POST inside application
const flash = require("express-flash"); // show us notifications throughout app
const logger = require("morgan"); // logs stuff to console for viewing
const connectDB = require("./config/database"); // connect to database
const mainRoutes = require("./routes/main"); // main routes
const postRoutes = require("./routes/posts"); // post routes

//Use .env file in config folder
require("dotenv").config({ path: "./config/.env" });

// Passport config
require("./config/passport")(passport);

//Connect To Database
connectDB();

//Using EJS for views
app.set("view engine", "ejs");

//Static Folder
app.use(express.static("public"));

//Body Parsing to pull things out of forms
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Logging
app.use(logger("dev"));

//Use forms for put / delete
app.use(methodOverride("_method"));

// Setup Sessions - stored in MongoDB
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
    store: new MongoStore({ mongooseConnection: mongoose.connection }),
  })
);

// Passport middleware
app.use(passport.initialize());
app.use(passport.session());

//Use flash messages for errors, info, ect...
app.use(flash());

//Setup Routes For Which The Server Is Listening
app.use("/", mainRoutes);
app.use("/post", postRoutes);

//Server Running
app.listen(process.env.PORT, () => {
  console.log(`Server is running on ${process.env.PORT}, you better catch it!`);
});
