const express = require("express");
const router = express.Router();
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const pool = require('../config/config')

const randtoken = require('rand-token');
const nodemailer = require('nodemailer');
const md5 = require('md5');
const mandrillTransport = require('nodemailer-mandrill-transport');

var smtpTransport = nodemailer.createTransport(mandrillTransport({
  auth: {
    apiKey: 'bAV03zWPNHiodhkVXNkhLQ'
  }
}));

// var otp = Math.random() * (1000000 - 99999) + 99999;
// var randomotp =123456;
// var otp = otp * 1000000;
// otp = parseInt(otp);
// var random = parseInt(otp);
// var a = random.toString();
// console.log(a);

require('dotenv').config();


//*****************OTPsend*********************/

router.post('/otpsend', async (req, res) => {

  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {
      var otp = Math.random() * (1000000 - 99999) + 99999;

      var random = parseInt(otp);
      var a = random.toString();
      console.log(a);

      var email = req.body.email;

      var mailOptions = {
        from: 'noreply@educationalemail.com',
        to: email,
        subject: "Otp for forget password is: ",
        html: "<h3>OTP for account verification is </h3>" + "<h1 style='font-weight:bold;'>" + a + "</h1>"
      };

      conn.query(`UPDATE identities SET otp=${a} WHERE email ="${email}"`, function (err) {
        if (err) {
          res.send({ result: err });
        } else {
          res.send({ result: "update successfull" });
        }

      });
      smtpTransport.sendMail(mailOptions, (error, info) => {
        if (error) {
          return console.log(error);
        }
        res.send({ Message: JSON.stringify(info) });
      });
      pool.releaseConnection(conn);
    }
  })

});

//****************Verify*********************//

router.post('/verify', async (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {
      var email = req.body.email;
      var otp = req.body.otp;

      conn.query(`SELECT * FROM identities WHERE email="${email}" AND otp=${otp}`, function (err, otp) {
        if (err) {
          res.send({ result: err });
        } else {
          if (otp.length > 0)
            res.send({ flag: 1 });
          else
            res.send({ flag: 0 });
        }
      });
      pool.releaseConnection(conn);
    }
  })
});

//****************Resetpassword*********************//

router.post('/resetpassword', async (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send('Server Error');
    }
    else {
      var email = req.body.email;
      var password = md5(req.body.password);

      conn.query(`UPDATE identities SET password="${password}" WHERE email="${email}"`, function (err,password) {
        if (err) {
          res.send({ result: err });
          if (!password) {
            console.log('Incorrect username error.');
            return done(null, false, { message: 'Incorrect username.' });
        }
        console.log('Trying user.validPassword() call');
        if (!password.validPassword(password)) {
            console.log('Incorrect password.');
            return done(null, false, { message: 'Incorrect password.' });
        }
        console.log('All correct, user found: ', password);
        return done(null, password);
        } else {
          res.send({ result: "password update successfull" });
        }
      });
      pool.releaseConnection(conn);
    }
  })

});


module.exports = router;





