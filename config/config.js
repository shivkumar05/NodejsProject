var mysql = require('mysql');

var poolconnection = mysql.createPool({
  host: 'localhost', // Replace with your host name
  port: '3306',
  user: 'root',      // Replace with your database username
  password: '',      // Replace with your database password
  database: 'clumcode' // // Replace with your database Name
});
module.exports = poolconnection;