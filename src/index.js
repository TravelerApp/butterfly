import React from "react";
import ReactDOM from "react-dom";
import { Switch, Route, BrowserRouter } from "react-router-dom";
import Landing from "./components/landing.js";
import Main from "./components/main.js";
//router page

//render itself

const Router = () => (
  <main>
    <Switch>
      <Route exact path="/" component={Landing} />
      <Route path="/main" component={Main} />
    </Switch>
  </main>
);

ReactDOM.render(
  <BrowserRouter>
    <Router />
  </BrowserRouter>,
  document.getElementById("app")
);
