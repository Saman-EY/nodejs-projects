const express = require("express");
const expressLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("express-flash");
const session = require("express-session");
const passport = require("passport");
const { passportInit } = require("./passport.config");
const { ErrorHandler, NotFoundError } = require("./utils/errorHandlers");
const { Allroutes } = require("./routes");

const app = express();
mongoose
  .connect("mongodb://localhost:27017/passport", {})
  .then(() => console.log("mongoose is connected"))
  .catch((err) => console.log(err));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(flash());

// set up view engine
app.use(expressLayouts);
app.set("view engine", "ejs");
app.set("layout", "./layout/main.ejs");

// set up session
app.use(
  session({
    secret: "keyboard cat",
    resave: false,
    saveUninitialized: false,
  })
);

// set up passport
passportInit(passport);
app.use(passport.initialize());
app.use(passport.session());

// Routes
app.use(Allroutes(passport));
app.use(NotFoundError);
app.use(ErrorHandler);
const PORT = process.env.PORT || 3000;

app.listen(3000, () => console.log(`server is running on ${PORT}`));
