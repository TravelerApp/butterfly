import React from "react";

const Trip = props => (
  <div className='tripListTrip'>
    <p className='tripListTitle' onClick={() => props.handleClick(props.trip)}>{props.city}, {props.country}</p><br/>
    <p className='tripListDates'>{new Date(props.trip.details.trip_start).toDateString()} to {new Date(props.trip.details.trip_end).toDateString()}</p><br/>
    <p className='tripListPurpose'>"{props.trip.details.purpose}"</p>
  </div>
);

export default Trip;