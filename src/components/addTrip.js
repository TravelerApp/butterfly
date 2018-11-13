import React from "react";
import Nav from "./navBar.js";

class Add extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h1>Title</h1>
        <Nav />
        <h3>This is The Add Trips Page</h3>
        <form>
          <input type="text" />
          <input type="submit" />
          <div className="mapbox">MapBOX</div>
        </form>
      </div>
    );
  }
}

export default Add;
