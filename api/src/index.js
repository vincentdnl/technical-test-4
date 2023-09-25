require("dotenv").config();
const bodyParser = require("body-parser");
const cors = require("cors");
const express = require("express");
const cookieParser = require("cookie-parser");

require("./mongo");

const { PORT, APP_URL } = require("./config.js");

const app = express();

const origin = [APP_URL, "https://join.le-stud.com"];

app.use(cors({ credentials: true, origin }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(express.static(__dirname + "/../public"));

app.use("/user", require("./controllers/user"));
app.use("/project", require("./controllers/project"));
app.use("/activity", require("./controllers/activity"));

const d = new Date();

app.get("/", async (req, res) => {
  res.status(200).send("API LOCAL TIME :  " + d.toLocaleString());
});

require("./passport")(app);

app.listen(PORT, () => console.log("Listening on port " + PORT));
