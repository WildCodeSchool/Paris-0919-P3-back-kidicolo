const express = require("express");
const connection = require("../../config/config");

const router = express.Router();

//select all article
router.get("/", (req, res) => {
  connection.query("SELECT * FROM Article INNER JOIN Photos ON Article.id = Photos.id", (err, results) => {
    if (err) {
      res.status(500).send(`Erreur lors de la récupération des articles!`);
    } else {
      res.status(200).json(results);
    }
  });
});

// get all article form subCat
router.get("/subcat/:id", (req, res) => {
  const idSubCat = req.params.id;
  connection.query(
    "SELECT * FROM Article WHERE id_subcategorie = ?",
    idSubCat,
    (err, results) => {
      if (err) {
        res
          .status(500)
          .send(
            `Erreur lors de la récupération  des articles lors de la séléction de la sous catégorie !`
          );
      } else {
        res.status(200).json(results);
      }
    }
  );
});

//select one article
router.get("/:id", (req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM Article WHERE id = ?", id, (err, results) => {
    if (err) {
      res.status(500).send(`Erreur lors de la récupération de l'article!`);
    } else {
      res.status(200).json(results);
    }
  });
});

//////////////////////Gérer un article/////////////////////
router.route("/signup").post((req, res) => {
  const newData = req.body;
  connection.query("INSERT INTO Article SET ?", newData, (err, results) => {
    console.log(err);
    if (err) {
      res.status(500).send(`Erreur lors de l'ajout de l'article!`);
    } else {
      res.status(200).json(results);
    }
  });
});

router.route("/switch/:id").put((req, res) => {
  const newData = req.body;
  const id = req.params.id;
  connection.query(
    "UPDATE  Article  SET ? WHERE id = ? ",
    [newData, id],
    (err, results) => {
      console.log(err);
      if (err) {
        res.status(500).send(`Erreur lors de la modification de l'article !`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

router.route("/delete/:id").delete((req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM Article WHERE id = ? ", id, (err, results) => {
    console.log(err);
    if (err) {
      res.status(500).send(`Erreur lors de la suppression de l'article !`);
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;
