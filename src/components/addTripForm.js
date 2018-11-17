import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import React, { Component } from "react";

export default class AddTripForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(),
      endDate: moment()
    };
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
  }
  handleStartDateChange(startDate) {
    this.setState({
      startDate: startDate
    });
  }
  handleEndDateChange(endDate) {
    this.setState({
      endDate: endDate
    });
  }
  render() {
    return (
      <div>
        <DatePicker
          selected={this.state.startDate}
          onChange={this.handleStartDateChange}
        />
        <h3> To </h3>
        <DatePicker
          selected={this.state.endDate}
          onChange={this.handleEndDateChange}
        />
        <input
          type="button"
          value="submit"
          onClick={() => this.props.handleClick(this.state)}
        />
      </div>
    );
  }
}
//doodoodeedoo
