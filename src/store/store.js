import { createStore, applyMiddleware } from "redux";
import rootreducer from "../reducers/main.js";

const store = createStore(
  rootreducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
);

export default store;
