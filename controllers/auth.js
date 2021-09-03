const localStrategy = require("passport-local");
const passport = require("passport");
const User = require("../models/user");


exports.getSignUp = (req, res) => {
  let error = req.flash("error");

  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/signup", {
    error: error,
  });
};

exports.postSignUp = (req, res) => {
  newUser = new User({
    username: req.body.username,
    name: req.body.name,
    gender: req.body.gender,
    address: req.body.address,
    age: req.body.age,
    contact: req.body.contact,
  });
  User.register(newUser, req.body.password, (err, user) => {
    if (err) {
      req.flash("error", "Enter valid credentials!");
      console.log(`Error:${err}`);
      return res.redirect("/signup");
    }
    console.log(`User Saved Details:${user}`);
    passport.authenticate("local")(req, res, function () {
      res.redirect("/login");
    });
  });
};

exports.getLogin = (req, res) => {
  console.log("we are here in get login")
  let error = req.flash("error");
  // console.log(error);
  console.log(req.flash("message"));

  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/login", {
    error: error,
  });
};

exports.getLogout = (req, res) => {
  req.logout();
  res.redirect("/");
};

exports.getResetPassword = (req, res) => {
  let error = req.flash("error");

  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("auth/reset-password", {
    error: error,
  });
};

exports.postResetPassword = (req, res) => {
  const email = req.body.email;
  let newUser;
  User.findOne({ username: email })
    .then((user) => {
      newUser = new User({
        username: user.username,
        name: user.name,
        gender: user.gender,
        address: user.address,
        age: user.age,
        contact: user.contact,
        cart: user.cart,
      });
      return user.remove();
    })
    .then(() => {
      User.register(newUser, req.body.password, (err, userNew) => {
        if (err) {
          req.flash("error", "Enter valid credentials!");
          console.log(`Error:${err}`);
          return res.redirect("/signup");
        } 
      });
    })
    .then((err, info) => {
      if (err) {
        
        console.log(err);
      } else {
        res.redirect("/login");
      }
      
    })
    .catch((err) => {
      console.log(err);
      res.redirect("/");
    });
};
