const express = require("express");
const mysql = require("mysql2");
const pool = require('../config/config')
const jsdom = "jsdom";
const { JSDOM } = jsdom;

const router = express.Router();
const md5 = require('md5');
const { verifyUser } = require("../middlewares/verifyUser");
require('dotenv').config();
const date = require('date-and-time')



router.post('/getprofile', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {

            // const Id = req.body.id;
            var email = req.body.email;

            conn.query(`SELECT * from profile where email="${email}"`, function (err, data) {
                if (err) {
                    console.log(err);
                    res.send({ result: "err", Error: err });
                } else {
                    res.send({ result: data });
                }
            });
            pool.releaseConnection(conn);
        }

    }
    )
})

router.post('/addprofile', async (req, res) => {
    pool.getConnection(async (err, conn) => {
        if (err) {
            console.log(err);
            res.status(500).send('Server Error');
        }
        else {
            var today = new Date();
            var dd = String(today.getDate()).padStart(2, '0');
            var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
            var yyyy = today.getFullYear();

            today = yyyy + '-' + mm + '-.' + dd;
            // const Id = req.body.id;
            var email = req.body.email;
            var gender = gender
            var date = date;
            var contact = req.body.contact;
            var height = req.body.height;
            var weight = req.body.weight;

            conn.query(`INSERT INTO profile (email,gender,date,contact,height,weight) VALUES ("${email}", "${gender}","${date}",${contact},"${height}","${weight}")`, function (err) {
                if (err) {
                    console.log(err);
                    res.send({ result: "err", Error: err });
                } else {
                    console.log("Successfully inserted data");
                    res.send({ result: "data inserted Successfully" });
                }
            });
            pool.releaseConnection(conn);
        }

    }
    )
})

// router.post('/updateprofile', async (req, res) => {
//     pool.getConnection(async (err, conn) => {
//         if (err) {
//             console.log(err);
//             res.status(500).send('Server Error');
//         }
//         else {
//             // const Id = req.body.id;
//             var user_name = req.body.username;
//             var email = req.body.email;
//             var profile = req.body.profile_pic;
//             conn.query(`UPDATE identities SET email="${email}",profile_pic="${profile}" WHERE username="${user_name}"`, function (err) {
//                 if (err) {
//                     console.log(err);
//                     res.send({ result: "err", Error: err });
//                 } else {
//                     console.log("Successfully update data");
//                     res.send({ result: "data update Successfully" });
//                 }
//             });
//             pool.releaseConnection(conn);
//         }

//     }
//     )
// })



module.exports = router;