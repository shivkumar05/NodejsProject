const express = require("express");
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const pool = require('../config/config')

const cookieParser = require("cookie-parser");
const router = express.Router();
require('dotenv').config();

router.use(cookieParser());



  router.post("/register", function (req, res) {
    const username = req.body.username;
    const password = md5(req.body.password);
    const email = req.body.email;
    pool.getConnection(function (err, conn) {
      if (err) {
        console.log(err);
      } else {
        conn.query("SELECT * FROM identities WHERE username=?", username, function (err, rows) {
          //console.log(rows);
          if (rows.length > 0) {
            res.send({rseult:"User name already exist"});
          } else {
            conn.query(`INSERT INTO identities ( username, password, email) VALUES ('${username}', '${password}','${email}')`, function (err) {
              if (err) {
                res.send({result:err});

              } else {
                res.send({result:"Sign up successfull"});
                console.log("Successfully inserted data");
              }
            })
          }
        })

        // pool.releaseConnection(conn);
      }
    })
  });

module.exports = router;
