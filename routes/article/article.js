const express = require("express");
const connection = require("../../config/config");
const router = express.Router();

//select all article
router.get("/", (req, res) => {
  connection.query("SELECT * FROM Article", (err, results) => {
    if (err) {
      res.status(500).send(`Erreur lors de la récupération des articles!`);
    } else {
      res.status(200).json(results);
    }
  });
});

// get all article from subCat
router.get("/subcat/:id", (req, res) => {
  const idSubCat = req.params.id;
  connection.query(
    "SELECT * FROM Article_subcategorie JOIN Article ON Article_subcategorie.id_article = Article.id WHERE Article_subcategorie.id_subcategorie = ?",
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

////////////////////// Route SearchBar //////////////////////////
router.post("/search/:id_subcategorie", (req, res) => {
  const name = req.body.name;
  const id_subcategorie = req.body.idSubCat
  console.log(req.body)
  console.log("subcatback", req.body.idSubCat)
  if(id_subcategorie =! null){
  connection.query("SELECT * FROM Article_subcategorie JOIN Article ON Article_subcategorie.id_article = Article.id WHERE Article_subcategorie.id_subcategorie  = ?", (err,results) => {
    if (err) {
      res.status(500).send(`Erreur lors de la récupération de l'article!`);
      console.log(err)
    } else {
      console.log(results)
      const resFilter = results.filter(elem => elem.name.toLowerCase().indexOf(name.toLowerCase()) > -1   )
      res.status(200).json(resFilter);
    }
  }
  )}else{
    connection.query("SELECT * FROM Article", (err, results) => {
      if (err) {
        res.status(500).send(`Erreur lors de la récupération de l'article!`);
      } else {
        // console.log(results)
        const resFilter = results.filter(elem => elem.name.toLowerCase().indexOf(name.toLowerCase()) > -1   )
        res.status(200).json(resFilter);
      }
    })}
  });
  // if (idSubcat = 1) {
    //   connection.query("SELECT * FROM Article_subcategorie JOIN Article ON Article_subcategorie.id_article = Article.id WHERE Article_subcategorie.id_subcategorie = 1", (err, results) =>{
      //     if (err){
        //       res.status(500).send(`Erreur lors de la récupération de l'article!`);
  //     } else {
  //       const resFilter = results.filter(elem => elem.name.toLowerCase().indexOf(name.toLowerCase()) > -1   )
  //     res.status(200).json(resFilter);
  //     }
  //   })
  // } if (idSubcat = 2) {
  //   connection.query("SELECT * FROM Article_subcategorie JOIN Article ON Article_subcategorie.id_article = Article.id WHERE Article_subcategorie.id_subcategorie = 2", (err, results) =>{
  //     if (err){
  //       res.status(500).send(`Erreur lors de la récupération de l'article!`);
  //     } else {
  //       const resFilter = results.filter(elem => elem.name.toLowerCase().indexOf(name.toLowerCase()) > -1   )
  //     res.status(200).json(resFilter);
  //     }
  //   })
  // } if (idSubcat = 3) {
  //   connection.query("SELECT * FROM Article_subcategorie JOIN Article ON Article_subcategorie.id_article = Article.id WHERE Article_subcategorie.id_subcategorie = 3", (err, results) =>{
  //     if (err){
  //       res.status(500).send(`Erreur lors de la récupération de l'article!`);
  //     } else {
  //       const resFilter = results.filter(elem => elem.name.toLowerCase().indexOf(name.toLowerCase()) > -1   )
  //     res.status(200).json(resFilter);
  //     }
  //   })
  // } if (idSubcat = 4) {
  //   connection.query("SELECT * FROM Article_subcategorie JOIN Article ON Article_subcategorie.id_article = Article.id WHERE Article_subcategorie.id_subcategorie = 4", (err, results) =>{
  //     if (err){
  //       res.status(500).send(`Erreur lors de la récupération de l'article!`);
  //     } else {
  //       const resFilter = results.filter(elem => elem.name.toLowerCase().indexOf(name.toLowerCase()) > -1   )
  //     res.status(200).json(resFilter);
  //     }
  //   })
  // } if (idSubcat = 5) {
  //   connection.query("SELECT * FROM Article_subcategorie JOIN Article ON Article_subcategorie.id_article = Article.id WHERE Article_subcategorie.id_subcategorie = 4", (err, results) =>{
  //     if (err){
  //       res.status(500).send(`Erreur lors de la récupération de l'article!`);
  //     } else {
  //       const resFilter = results.filter(elem => elem.name.toLowerCase().indexOf(name.toLowerCase()) > -1   )
  //     res.status(200).json(resFilter);
  //     }
  //   })
  // } else {
//////////////////////Gérer un article/////////////////////
router.route("/signup").post((req, res) => {
  const newData = req.body;
  connection.query("INSERT INTO Article SET ?", newData, (err, results) => {
    console.log(err);
    if (err) {
      res.status(500).send(`Erreur lors de l'ajout de l'article!`);
    } else {
      console.log(results)
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
