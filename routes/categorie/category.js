const express = require("express");
const connection = require("../../config/config");
const router = express.Router();

//select all category
router.get("/", (req, res) => {
  connection.query("SELECT * FROM Categorie", (err, results) => {
    if (err) {
      res.status(500).send(`Erreur lors de la selection de la catégorie !`);
    } else {
      res.status(200).json(results);
    }
  });
});

// get subCat
router.get("/subcat/:id", (req, res) => {
  const idCategorie = req.params.id;
  connection.query(
    "SELECT * FROM Sub_categorie WHERE id_categorie = ?",
    idCategorie,
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send(
            `Erreur lors de la  selection des subcategories lors de la selection de la categorie!`
          );
      } else {
        res.status(200).json(results);
      }
    }
  );
});

router.get("/:name", (req, res) => {
  const nameCategorie = req.params.name;
  connection.query(
    "SELECT * FROM Categorie WHERE name = ?",
    nameCategorie,
    (err, results) => {
      if (err) {
        res.status(500).send(`Erreur lors de la  selection de la catégorie!`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

module.exports = router;
