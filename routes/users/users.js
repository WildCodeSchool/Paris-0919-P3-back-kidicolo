const express = require("express");
const connection = require("../../config/config");
const router = express.Router();
var bcrypt = require('bcryptjs');



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
  const user = {
    firstname: req.body.firstname,
    mail: req.body.mail,
    lastname: req.body.lastname,
    password:  bcrypt.hashSync(req.body.password, 10),
    mobile: req.body.mobile,
    address: req.body.address,
    photo_user : req.body.photo_user,
  }
  connection.query("INSERT INTO User SET ?", user, (err, results) => {
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
  const user = {
    firstname: req.body.firstname,
    mail: req.body.mail,
    lastname: req.body.lastname,
    password:  bcrypt.hashSync(req.body.password, 10),
    mobile: req.body.mobile,
    address: req.body.address,
    photo_user : req.body.photo_user,
  }
  const id = req.params.id;
  connection.query(
    "UPDATE  User  SET ? WHERE id = ? ",
    [user, id],
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
