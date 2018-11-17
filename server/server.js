require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const db = require("../knex/knex.js");
//const db = require('../knex/knex.js');
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

// app.get("/*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../dist/index.html"));
// });

// users table
app.post("/addUser", (req, res) => {
  db.postUser(req.body.auth_id);
  res.sendStatus(201);
});
app.get("/getUsers", (req, res) => {
  db.getUsers(data => {
    res.send(data);
  });
});
app.post("/updateUser", (req, res) => {
  db.updateUserProfile(req.body);
  res.sendStatus(200);
});

// trips table
app.post("/addTrip", (req, res) => {
  db.insertTrip(req.body);
  res.sendStatus(201);
});
app.get("/getTrips", (req, res) => {
  db.getTrips(data => {
    res.send(data);
  });
});

app.listen(port, function() {
  console.log("Now listening on port " + port + "!");
});
