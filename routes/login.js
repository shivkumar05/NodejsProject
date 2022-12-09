
const express = require("express");
const mysql = require("mysql2");
const jwt = require('jsonwebtoken');
const md5 = require('md5');
const pool = require('../config/config')
const cookieParser = require("cookie-parser");
const router = express.Router();
require('dotenv').config();

router.use(cookieParser());

router.use(express.urlencoded({extended: true}));

const generateAccessToken =(email) => {
  return jwt.sign(email, process.env.TOKEN_SECRET);
};



router.post("/", function (req, res) {
  const email = req.body.email;
  const password = md5(req.body.password);
 
  pool.getConnection(function (err, conn) {
    if (err) {
      console.log(err);
    } else {
      conn.query("SELECT * FROM identities WHERE email=?", email, function (err, rows) {

        if (rows.length > 0) {
          if (rows[0].password === password) {
            const user_id1 = rows[0].id;

            const token = generateAccessToken({ email, user_id1 });
            
            res.json({login:true,token:token,user_id:user_id1, msg:"Login successfull"});
          } else {
            console.log("incorrect password");
            res.send({login:false, msg:"Incorrect password"});
          }
        } else {
          res.send({login:false, msg:"User not found"});
        }
      })
      pool.releaseConnection(conn);
    }
  })
});


module.exports = router;
