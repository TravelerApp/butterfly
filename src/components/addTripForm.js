import DatePicker from "react-datepicker";
import moment from "moment";
import "react-datepicker/dist/react-datepicker.css";
import React, { Component } from "react";
import Nav from "./navBar.js";
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
    //adding comment to be deleted later
    this.setState({
      endDate: endDate
    });
  }
  render() {
    return (
      <div className="add-trip-container-div">
        <div className="form-div">
          <div className="add-trip-form-header">
            <p className="please-select-p">When are you going?</p>
            <hr />
          </div>
          <div className="from-to-div">
            <p className="select-country-p">From:</p>
            <DatePicker
              className="date-picker"
              selected={this.state.startDate}
              onChange={this.handleStartDateChange}
            />
          </div>
          <div className="from-to-div">
            <p className="select-country-p">To: </p>
            <DatePicker
              className="date-picker"
              selected={this.state.endDate}
              onChange={this.handleEndDateChange}
            />
          </div>
          <div className="trip-reason-div">
            <label className="trip-reason-lable" for="tripreason">
              Reason for Trip:
            </label>
            <textarea
              className="trip-reason-text-area"
              id="reason"
              name="reason"
              rows="5"
              cols="35"
            />
          </div>
          <div className="save-your-trip-button-div">
            <input
              className="save-your-trip-button"
              type="button"
              value="Save your Trip"
              onClick={() =>
                this.props.handleClick({
                  start: this.state.startDate._d,
                  end: this.state.endDate._d,
                  reason: document.getElementById("reason").value
                })
              }
            />
          </div>
        </div>
      </div>
    );
    // <div>
    //   <div>
    //     <DatePicker
    //       selected={this.state.startDate}
    //       onChange={this.handleStartDateChange}
    //     />
    //     <h3> To </h3>
    //     <DatePicker
    //       selected={this.state.endDate}
    //       onChange={this.handleEndDateChange}
    //     />
    //   </div>
    //   <div>
    //     <label for="tripreason">Reason for Trip:</label>
    //     <br />
    //     <textarea id="reason" name="reason" rows="5" cols="33" />>
    //   </div>
    //   <input
    //     type="button"
    //     value="Save your Trip"
    //     onClick={() =>
    //       this.props.handleClick({
    //         start: this.state.startDate._d,
    //         end: this.state.endDate._d,
    //         reason: document.getElementById("reason").value
    //         /// wutttt
    //         //destination: this.props.currentCities
    //       })
    //     }
    //   />
    // </div>;
    // );
  }
}
