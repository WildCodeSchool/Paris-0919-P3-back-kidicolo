const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const bodyParser = require("body-parser");
const routes = require("./routes/index");
// const cookieParser = require ("cookier-parser")

const PORT = process.env.PORT || "5000";
const app = express();

app.use(cors("*"));
app.use(morgan("dev"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/article", routes.article);
app.use("/category", routes.category);
app.use("/subcategory", routes.subcategory);
app.use("/adduser", routes.adduser);
app.use("/age", routes.age);
app.use("/gender", routes.gender);
app.use("/statearticle", routes.statearticle);
app.use("/photo", routes.photo);

app.get("/", (req, res) => {
  res.send("Road");
});

app.listen(PORT, console.log(`http://localhost:${PORT}`));
