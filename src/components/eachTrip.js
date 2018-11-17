import React from "react";

const Trip = props => (
  <div onClick={() => props.click(props.trip)}>
    <div>{props.trip}</div>
    <div>Trip:{props.key}</div>
  </div>
);

export default Trip;
