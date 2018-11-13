import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Landing from "./landing.js";
import Main from "./main.js";
import Add from "./addTrip.js";
import Next from "./currentTrips.js";
import Mess from "./messages.js";
import Create from "./createProfile.js";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route path="/main" component={Main} />
      <Route path="/add" component={Add} />
      <Route path="/next" component={Next} />
      <Route path="/mess" component={Mess} />
      <Route path="/create" component={Create} />
    </Switch>
  </BrowserRouter>
);

export default App;
