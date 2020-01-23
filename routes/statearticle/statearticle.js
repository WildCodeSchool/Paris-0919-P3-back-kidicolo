const express = require("express");
const connection = require("../../config/config");

const router = express.Router();

//select all article
router.get("/", (req, res) => {
  connection.query(
    "SELECT * from State",
    (err, results) => {
      if (err) {
        res.status(500).send(`Erreur lors de la récupération des articles!`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

module.exports = router;