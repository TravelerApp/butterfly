import React from "react";

const Poss = props => (
  <div onClick={() => props.click(props.value)}>
    <div>{props.connection}</div>
  </div>
);
export default Poss;
