const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const app = express();

let port = process.env.PORT;
if (port == null || port == "") {
  port = 3000;
}

app.use(express.static(__dirname + "/../dist"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);

app.listen(port, function() {
  console.log("Now listening on port " + port + "!");
});
