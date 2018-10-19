"use strict";

var nodemailer = require('nodemailer');

var mail = require('./template2');

var accountCreationMail = function accountCreationMail(User) {
  var transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    // true for 465, false for other ports
    auth: {
      user: 'campushappiness2@gmail.com',
      pass: 'campusbonheur'
    }
  }); // setup email data with unicode symbols

  var mailOptions = {
    from: '"Campus happyness team" <campushapiness2@gmail.com>',
    // sender address
    to: User.email,
    // list of receivers
    subject: "Votre nouveau compte CampusHappyness, ".concat(User.firstName, "?"),
    // Subject line
    html: mail(User),
    text: "Link: http://localhost:3000/login"
  }; // send mail with defined transport object

  transporter.sendMail(mailOptions, function (error, info) {
    if (error) {
      return console.log(error);
    }

    console.log('Account message sent: %s', info.messageId);
  });
};

module.exports = accountCreationMail;
//# sourceMappingURL=accountCreation.js.map