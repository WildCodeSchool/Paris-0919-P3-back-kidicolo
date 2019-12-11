const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const bodyParser = require("body-parser")
const connection = require("./config/config")
const routes = require("./routes/index")

const PORT = "4242"

const app = express()

app.use(cors("*"))
app.use(morgan("dev"))

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// app.use(express.static(__dirname + "/public"))

app.use("/article", routes.article)
app.use("/category", routes.category)

app.get("/", (req, res) => {
  res.send("je suis dans la route /")
})

app.listen(PORT, console.log(`http://localhost:${PORT}`))
