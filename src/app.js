const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");

require("./db/config");
const User = require("./models/user.model");

const app = express();
const static_path = path.join(__dirname + "/public");

app.use(express.static(static_path));
app.use(bodyParser.urlencoded({ extended: true }));

//default page
app.get("/", (req, res) => {
  res.sendFile(__dirname + "/index.html");
});

//login page
app.get("/login", (req, res) => {
  res.sendFile(__dirname + "/login.html");
});

//sign up an user
app.post("/", async (req, res) => {
  try {
  } catch (err) {
    res.status(400).send(err);
  }
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
