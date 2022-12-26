//modules
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const { body, checkSchema, validationResult } = require("express-validator");
require("dotenv").config();

//database configuration
require("./db/config");
const User = require("./models/user.model");

const app = express();

//todo:password encryption using bcrypt

//middlewares
app.set("views", "./src/views");
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(bodyParser.urlencoded({ extended: true }));

//home route
app.get("/", (req, res) => {
  res.render("home");
});

//login page
app.get("/login", (req, res) => {
  res.render("login");
});

//success page
app.get("/success", (req, res) => {
  res.render("success");
});

//failure page, all errors
app.get("/:errortype/failure", (req, res) => {
  let type = req.params.errortype;
  if (type === "novalidation") {
    res.render("failure", {
      message: "Sorry! Please enter the details correctly",
    });
  } else if (type === "notFound") {
    res.render("failure", {
      message:
        "Sorry! User not found! Please register first or enter credentials correctly..",
    });
  } else if (type === "serverError") {
    res.render("failure", {
      message: "Sorry! Server Error! Please try again :(",
    });
  }
});

//custom validator
const validate = (validations) => {
  return async (req, res, next) => {
    await Promise.all(validations.map((validation) => validation.run(req)));

    const errors = validationResult(req);
    if (errors.isEmpty()) {
      return next();
    }
    console.log(errors.array());
    //validation unsuccessful
    res.status(400).redirect("/novalidation/failure");
  };
};

//login validation
app.post(
  "/login",
  validate([
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({
      min: 8,
      max: 20,
    }),
  ]),
  async (req, res) => {
    try {
      let email = req.body.email;
      let password = req.body.password;
      const user = await User.findOne({
        email: email,
        password: password,
      });
      if (user) {
        //user found
        console.log(user);
        res.status(200).render("dashboard", {
          firstname: user.firstname,
          lastname: user.lastname,
          email: user.email,
          address: user.address,
          age: user.age,
        });
      } else {
        res.status(400).redirect("/notFound/failure");
      }
    } catch (err) {
      console.log(err);
      //validation mismatch
      res.status(400).redirect("/novalidation/failure");
    }
  }
);

//validation schema for signup/registration
const registrationSchema = {
  firstname: {
    notEmpty: true,
    errorMessage: "First Name cannot be empty",
  },
  lastname: {
    notEmpty: true,
    errorMessage: "Last Name cannot be empty",
  },
  email: {
    custom: {
      options: (value) => {
        return User.find({
          email: value,
        }).then((user) => {
          if (user.length > 0) {
            return Promise.reject("Email already registered!");
          }
        });
      },
    },
  },
};

//signup validation and user registration
app.post(
  "/",
  validate(checkSchema(registrationSchema)),
  validate([
    body("email").isEmail().normalizeEmail(),
    body("password").isLength({
      min: 8,
      max: 20,
    }),
  ]),
  async (req, res) => {
    try {
      //user inputs
      let fname = req.body.firstname;
      let lname = req.body.lastname;
      let email = req.body.email;
      let address = req.body.address;
      let age = req.body.age;
      let password = req.body.password;
      let confirm_password = req.body.confirmpassword;

      //password match
      if (password !== confirm_password) {
        return res.status(400).redirect("/novalidation/failure");
      }

      //save new user and redirect to success page
      let user = new User({
        firstname: fname,
        lastname: lname,
        email: email,
        address: address,
        age: age,
        password: password,
      });
      const saved_user = await user.save();
      if (saved_user) {
        res.status(200).redirect("/success");
      } else {
        res.status(200).redirect("/serverError/failure");
      }
    } catch (err) {
      console.log(err);
      res.status(400).redirect("/novalidation/failure");
    }
  }
);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`server running on port ${port}`);
});
