import React from "react";

const Trip = props => (
  <div>
    <button onClick={() => props.click("France")}>Trip 1 to France</button>
    <button onClick={() => props.click("Cambodia")}>Trip 2 to Cambodia</button>
  </div>
);

export default Trip;
