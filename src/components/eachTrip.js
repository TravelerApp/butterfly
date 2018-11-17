import React from "react";

const Trip = props => (
  <div onClick={() => props.click(props.value)}>
    <div>
      Your Trip to {props.trip}, {props.country}
    </div>
  </div>
);

export default Trip;
