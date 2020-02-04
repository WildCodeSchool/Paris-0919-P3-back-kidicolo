const express = require("express");
const connection = require("../../config/config");
const router = express.Router();
var bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;

router.route("/getinfo/:id").get((req, res) => {
  const id = req.params.id;
  connection.query("SELECT * FROM Users where id = ?", id, (err, results) => {
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
    password: bcrypt.hashSync(req.body.password, 10),
    mobile: req.body.mobile,
    location: req.body.location,
    photo_user: req.body.photo_user
  };
  connection.query("INSERT INTO Users SET ?", user, (err, results) => {
    console.log(err);
    if (err) {
      res.status(500).send(`Erreur lors de l'inscription !!`);
    } else {
      res.status(200).json(results);
    }
  });
});

router.route("/login").post((req, res) => {
  const mail = req.body.mail;
  const password = req.body.password;

  if (!mail) {
    console.log(req.body)
    return res.status(409).send("Unknown user");
  }

  connection.query(
    `SELECT * FROM  Users WHERE mail = ?`,
    mail,
    (err, result) => {
      if (err) {
        return res.status(500).send(err,"Les champs ne sont pas remplis");
      } else if (!result[0]) {
        return res.status(401).send("Unauthorized user");
      }
      const passwordIsValid = bcrypt.compareSync(password, result[0].password);
      if (!passwordIsValid || result.length < 0) {
        return res.status(401).send({ auth: false, token: null });
      } else {
        const token = jwt.sign(
          {
            id: result[0].id,
            firstname: result[0].firstname,
            mail: result[0].mail
          },
          jwtSecret,
          {
            expiresIn: "1h" // expires in 1 hours
          },
          { algorithm: "RS256" }
        );
        res.header("Access-Control-Expose-Headers", "x-access-token");
        res.set("token", token);
        res.status(200).send({ auth: true });
        console.log(token);
      }
    }
  );
});

router.route("/switch/:id").put((req, res) => {
  const user = {
    firstname: req.body.firstname,
    mail: req.body.mail,
    lastname: req.body.lastname,
    password: bcrypt.hashSync(req.body.password, 10),
    mobile: req.body.mobile,
    location: req.body.location,
    photo_user: req.body.photo_user
  };
  const id = req.params.id;
  connection.query(
    "UPDATE  Users  SET ? WHERE id = ? ",
    [user, id],
    (err, results) => {
      console.log(err);
      if (err) {
        res
          .status(500)
          .send(`Erreur lors de la modification des paramètres du user !!`);
      } else {
        res.status(200).json(results);
      }
    }
  );
});

router.route("/delete/:id").delete((req, res) => {
  const id = req.params.id;
  connection.query("DELETE FROM Users WHERE id = ? ", id, (err, results) => {
    console.log(err);
    if (err) {
      res
        .status(500)
        .send(`Erreur lors de la récupération de la suppression du user !!`);
    } else {
      res.status(200).json(results);
    }
  });
});

module.exports = router;
