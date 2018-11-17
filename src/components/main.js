import React from "react";
import Nav from "./navBar.js";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Nav />
        <div>PLEASE WAIT AS WE LOAD YOUR INFORMATION!</div>
      </div>
    );
  }
}
export default Main;
