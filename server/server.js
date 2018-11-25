require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const axios = require("axios");
const path = require("path");
const db = require("../knex/knex.js");
const app = express();


let port = process.env.PORT || 3000;

app.use(express.static(__dirname + "/../dist"));
app.use(bodyParser.json());
app.use(
  bodyParser.urlencoded({
    extended: false
  })
);


// SEE NOTES for .post('/user') regarding logical flow for user login

app.get('/initial/:authid', (req, res) => {
  // probably want to pull authid from passport session if possible
  db.getAllUserInformation(req.params.authid)
  .then(allTheStuff => {
    res.status(200).json(allTheStuff);
  })
  .catch(err => {
    console.log(err);
    res.status(500).send(err);
  })
});


// ---------------USERS TABLE---------------

// endpoint below ONLY adds a user's auth_id to database
// in the end, we probably won't have this as an endpoint?
//    instead, db.method called from within the auth route to determine which future actions to take
//    the error thrown will indicate that the auth_id already exists (error.code === '23505')
//    can use this error code on client to trigger a call to the "big initial query"
//        if this initial query returns null for profile, send to create profile page
//        if initial query does not return null for profile
//            if initial query returns null for upcomingTrips, send to add trip page
//            if initial query does NOT return null for upcomingTrips, send to upcomingTrips page
app.post("/user", (req, res) => {
  db.postUser(req.body.auth_id)
  .then(data => {
    console.log('user auth_id successfully inserted into users database')
    res.sendStatus(201);
  })
  .catch(err => {
    console.log('error received trying to insert auth_id into database:', err);
    res.status(409).send(err);
  })
})

app.patch("/user", (req, res) => {
  db.updateUserProfile(req.body)
  .then(profile => {
    console.log('user\'s profile successfully updated')
    res.status(200).json(profile[0])
  })
  .catch(err => {
    console.log('error received trying to update user\'s profile:', err);
    res.status(400).send(err);
  })
})



// ----------------TRIPS TABLE----------------
app.post("/trip", (req, res) => {
  db.createTrip(req.body)
  .then(trip => {
    console.log('trip successfully inserted into database, returning trip with connections:', trip);
    res.status(201).json(trip);
  })
  .catch(err => {
    console.log('error received trying to add trip to database:', err);
    res.status(400).send(err);
  })
});


// ---------------MESSAGES TABLE---------------
app.post("/message", (req, res) => {
  db.createChat(req.body)
  .then(chat => {
    console.log('chat successfully created, returning chat object:', chat);
    res.status(201).send(chat);
  })
  .catch(err => {
    console.log('error received trying to create new chat:', err);
    res.status(400).send(err)
  })
})

app.patch("/message", (req, res) => {
  db.updateChat(req.body)
  .then(chat => {
    console.log('chat successfully created, returning chat object:', chat);
    res.status(201).send(chat);
  })
  .catch(err => {
    console.log('error received trying to create new chat:', err);
    res.status(400).send(err)
  })
})


// ------------SERVE APP AND LISTEN------------
app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(port, () => {
  console.log("Now listening on port " + port + "!");
});