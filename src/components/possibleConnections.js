import React from "react";

// style this to be a little box that also includes user's picture
// we can add or remove information from this display
const Poss = props => (
  <div onClick={() => props.click(props.value)}>
    <div>{props.connection}</div>
    <div>{props.from}</div>
    <div>{props.purpose}</div>
  </div>
);
export default Poss;
