require("dotenv").config();
require("./config/db");
const express = require("express");
const passport = require("passport");
const cors = require("cors");

const app = express();

//initialize passport
require("./config/passport")(passport);
app.use(passport.initialize());

//cors setup
app.use(
  cors({
    origin: "*",
  })
);

//request body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//handle routes
app.use(require("./routes"));

//start server
app.listen(process.env.PORT, () => {
  console.log(`Server is running on port: ${process.env.PORT}`);
});
