import React from "react";
import { Switch, Route, BrowserRouter, Redirect } from "react-router-dom";
import Landing from "./landing.js";
import Main from "./main.js";
import Add from "./addTrip.js";
import Next from "./currentTrips.js";
import Mess from "./messages.js";
import Create from "./createProfile.js";
import NotFound from "./notFound.js";
import ViewSelf from "./viewSelf.js";
import Nav from "./navBar.js";
import Messages from './messages.js';

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route
        path="/main"
        render={() =>
          sessionStorage.getItem("banana") ? <Main /> : <Redirect to="/" />
        }
      />
      <Route
        path="/add"
        render={() =>
          sessionStorage.getItem("banana") ? <Add /> : <Redirect to="/" />
        }
      />
      <Route
        path="/next"
        render={() =>
          sessionStorage.getItem("banana") ? <Next /> : <Redirect to="/" />
        }
      />
      <Route
        path="/mess"
        render={() =>
          sessionStorage.getItem("banana") ? <Mess /> : <Redirect to="/" />
        }
      />
      <Route
        path="/create"
        render={() =>
          sessionStorage.getItem("banana") ? <Create /> : <Redirect to="/" />
        }
      />
      <Route
        path="/viewprofile"
        render={() =>
          sessionStorage.getItem("banana") ? <ViewSelf /> : <Redirect to="/" />
        }
      />
      <Route component={NotFound} />
    </Switch>
  </BrowserRouter>
);

export default App;

//compare session storage id vs Loggedin id in store MVPAAAAAY
