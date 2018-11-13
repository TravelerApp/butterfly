import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { createStore } from "redux";
//import store from './store/store';
import App from "./components/app.js";

ReactDOM.render(
  //<Provider store={store}>
  <App />,
  //</Provider>
  document.getElementById("app")
);
