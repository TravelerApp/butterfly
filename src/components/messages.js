import React from "react";
import Nav from "./navBar.js";

class Mess extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Title</h1>
        <Nav />
        <h3>This is The Messages Page</h3>
      </div>
    );
  }
}
export default Mess;
