const express = require("express");
const connection = require("../../config/config");
const router = express.Router();



router.route("/getinfo/:id").get((req, res) => {
    const id = req.params.id;
    connection.query("SELECT * FROM User where id = ?",id, (err, results) => {
      console.log(err);
      if (err) {
        res
          .status(500)
          .send(`Erreur lors de la récupération de la liste des users !!`);
      } else {
        res.status(200).json(results);
      }
    });
  });

router.route("/signup").post((req, res) => {
  const newData = req.body;
  connection.query("INSERT INTO User SET ?", newData, (err, results) => {
    console.log(err);
    if (err) {
      res
        .status(500)
        .send(`Erreur lors de la récupération de la liste des users !!`);
    } else {
      res.status(200).json(results);
    }
  });
});

router.route("/switch/:id").put((req, res) => {
  const newData = req.body;
  const id = req.params.id;
  connection.query(
    "UPDATE  User  SET ? WHERE id = ? ",
    [newData, id],
    (err, results) => {
      console.log(err);
      if (err) {
        res
          .status(500)
          .send(`Erreur lors de la récupération de la liste des users !!`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

router.route("/delete/:id").delete((req, res) => {

  const id = req.params.id;
  connection.query(
    "DELETE FROM User WHERE id = ? ",
     id,
    (err, results) => {
      console.log(err);
      if (err) {
        res
          .status(500)
          .send(`Erreur lors de la récupération de la liste des users !!`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

module.exports = router;
