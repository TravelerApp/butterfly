import { createStore, applyMiddleware } from "redux";
import rootreducer from "../reducers/main.js";

const store = createStore(rootreducer);

export default store;
