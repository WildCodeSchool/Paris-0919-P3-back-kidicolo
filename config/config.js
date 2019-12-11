const mysql = require("mysql")

const connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "yolo6789",
  database: "kidicolo"
})

connection.connect(err => {
  if (!err) {
    console.log("Database is connected")
  } else {
    console.log("Error connecting database", err)
  }
})

module.exports = connection
