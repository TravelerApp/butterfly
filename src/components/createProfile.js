import React from "react";
import { Link } from "react-router-dom";

class Create extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <form>
        <input type="text" /> Your Name!
        <input type="text" /> Where Are You From!
        <input type="text" /> This Will Be Selectors!
        <input type="submit" />
      </form>
    );
  }
}
