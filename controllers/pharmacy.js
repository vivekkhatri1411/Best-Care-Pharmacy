const Contact = require("../models/contact");
var nodemailer = require('nodemailer');

exports.getHome = (req, res) => {
  let error = req.flash("error");

  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("pharmacy/index", {
    error: error,
  });
};

exports.getContactUs = (req, res) => {
  let error = req.flash("error");

  if (error.length > 0) {
    error = error[0];
  } else {
    error = null;
  }
  res.render("pharmacy/contact", {
    error: error,
  });
};

exports.postContactUs = (req, res) => {
  console.log("we are herre in contact us", req.body)
  newContact = new Contact({
    email: req.body.email,
    name: req.body.name,
    message: req.body.message,
    phone: req.body.phone
  });

  newContact.save( function (err, data) {
    if (err) {
      req.flash("error", "Please try again");
      console.log(`Error:${err}`);
    }
    if(data){
      var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'erchetannarang@gmail.com',
            pass: 'chetan123@###'
        }
    });

      let mailOptions = {
        from: data.email,
        to: "chetannarang123@gmail.com",
        subject: "Contact Us",
        text: `Hey there, someone send you message ${data.message}`,
      };
      transporter.sendMail(mailOptions, (err, info) => {
        if (err) {
          console.log(`Email Not Send!\n`);
          console.log(err);
        } else {
          console.log(`Email sent successfully: ${info.response}`);
        }
        return res.redirect("/");
      });
    }
  });
};