const express = require("express");
const connection = require("../../config/config");
const router = express.Router();

router.get("/", (req, res) => {
  connection.query("SELECT * FROM Sub_categorie", (err, results) => {
    if (err) {
      res
        .status(500)
        .send(`Erreur lors de la récupération de la liste des subcatégorie !!`);
    } else {
      res.status(200).json(results);
    }
  });
});

router.get("/:id", (req, res) => {
  const id = req.params.id;
  connection.query(
    "SELECT * FROM Sub_categorie WHERE id_categorie = ?",
    id,
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send(`Erreur lors de la récupération de la liste des subcatégories !!`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

module.exports = router;
