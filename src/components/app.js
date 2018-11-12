import React from "react";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Landing from "./components/landing.js";
import Main from "./components/main.js";

const App = () => (
  <BrowserRouter>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route path="/main" component={Main} />
    </Switch>
  </BrowserRouter>
);

export default App;
