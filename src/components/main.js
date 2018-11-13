import React from "react";
import Nav from "./navBar.js";

class Main extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Im the Butterfly Title</h1>
        <Nav />
      </div>
    );
  }
}
export default Main;
