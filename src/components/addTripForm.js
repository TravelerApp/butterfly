import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import React, { Component } from "react";

export default class AddTripForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      startDate: moment(moment(), moment.HTML5_FMT.DATE),
      endDate: moment()
    };
    this.handleEndDateChange = this.handleEndDateChange.bind(this);
    this.handleStartDateChange = this.handleStartDateChange.bind(this);
  }
  handleStartDateChange(startDate) {
    console.log(this.props);
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
        </div>
        <div>
          <label for="tripreason">Reason for Trip:</label>
          <br />
          <textarea id="reason" name="reason" rows="5" cols="33" />>
        </div>
        <input
          type="button"
          value="Save your Trip"
          onClick={() =>
            this.props.handleClick({
              Start: this.state.startDate._d,
              End: this.state.endDate._d,
              Reason: document.getElementById("reason").value,
              Destination: this.props.currentCities
            })
          }
        />
      </div>
    );
  }
}
