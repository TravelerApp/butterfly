require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const db = require('../knex/knex.js');
const app = express();

let port = process.env.PORT || 3000;
// if (port == null || port == "") {
//   port = 3000;
// }

app.use(express.static(__dirname + "/../dist"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, function() {
  console.log("Now listening on port " + port + "!");
});