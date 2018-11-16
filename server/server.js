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


app.get('/initial/:authid', (req, res) => {
  db.getAllUserInformation(req.params.authid)
  .then(data => {
    res.status(200).json(data); //map(object => object.rows)
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
});

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, function() {
  console.log("Now listening on port " + port + "!");
});