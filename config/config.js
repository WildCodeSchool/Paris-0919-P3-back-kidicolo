const mysql = require("mysql");
require("dotenv").config(process.cwd(), ".env");
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PWD,
  database: process.env.DB_DB,
  port: process.env.DB_PORT,
});

connection.connect((err) => {
  if (!err) {
    console.log(`😎😎 -- MySql is connected -- 😎😎`);
  } else {
    console.log("-- 👎 👎  -- Error connecting MySql : -- 👎 👎 -- ", err);
  }
});

module.exports = connection;
