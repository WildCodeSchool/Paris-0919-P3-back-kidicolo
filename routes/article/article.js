const express = require("express");
const connection = require("../../config/config");

const router = express.Router();

//select all article
router.get("/", (req, res) => {
  connection.query("SELECT * FROM Article left join Photos on Article.id = Photos.id  ", (err, results) => {
    if (err) {
      res.status(500).send(`Erreur lors de la récupération des articles!`);
    } else {
      res.status(200).json(results);
    }
  });
});

// get all article form subCat a refaire!!!
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
router.route("/addarticle").post((req, res) => {
  const body = req.body;
  connection.query(`INSERT INTO Article (brand , description, price, sold, name, id_state,id_user_acheteur,id_user_vendeur,id_photoart) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)`, [body.brand, body.description, body.price, body.sold, body.name, body.id_state, body.id_user_acheteur, body.id_user_vendeur, body.id_photoart],
  err => {
    if(err){
      console.log(err)
      res.send("Error creating article")
    }
    else{
      connection.query(`INSERT INTO Article_categorie VALUES ( (SELECT id from Article where name = ? and brand = ? and description = ?), (SELECT id FROM Categorie WHERE name = ?))`, [body.brand, body.name, body.description],
      err => {
        if(err) {
          res.send ("Error affiliating article to categorie");
        }else{
        connection.query(`INSERT INTO Article_subcategorie VALUES ( (SELECT id from Article where name = ? and brand = ? and description = ?), (SELECT id FROM Sub_Categorie WHERE name = ?))`, [body.brand, body.name, body.description],
        err => {
          if(err){
            res.send("Error afiliating article to sub");
          } else
          res.send(`Succesfully created article`).status(200)
        }
        );
      }
    }
  )
  }})});

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
