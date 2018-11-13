import React from "react";
import Nav from "./navBar.js";
import Trip from "./eachTrip.js";

class Next extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <Nav />
        <h3>This is The Current Trips Page</h3>
        <Trip />

        {/* map out trips trip = {trip} */}
      </div>
    );
  }
}
export default Next;
