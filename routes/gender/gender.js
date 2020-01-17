const express = require("express")
const connection = require("../../config/config")
const router = express.Router()


router.get("/", (req, res) => {
    connection.query("SELECT * FROM Gender", (err, results) => {
      if (err) {
        res
          .status(500)
          .send(`Erreur lors de la selection de la catégorie !`)
      } else {
        res.status(200).json(results)
      }
    })
  })

module.exports = router