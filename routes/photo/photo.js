const express = require("express");
const connection = require("../../config/config");

const router = express.Router();

//select all article
router.get("/:id", (req, res) => {
	const id = req.params.id
	console.log(id)
  connection.query("SELECT * FROM Photos WHERE id = ?", id, (err, results) => {
    if (err) {
      res.status(500).send(`Erreur lors de la récupération des articles!`);
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;
