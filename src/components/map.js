import React, { Component } from "react";
import GoogleMap from "google-map-react";
const NodeGeocoder = require("node-geocoder");

export default class Map extends Component {
  constructor(props) {
    super(props);
    this.state ={
        clickedCity: '',
        clickedCountry: ''
    }    
}
  getLocation(lat, lng) {
    let geocoder = NodeGeocoder({
      provider: "google",
      httpAdapter: "https",
      apiKey: "AIzaSyD773VvabcqtdV3xw3MGNpb6mA8SnXq3KU",
      formatter: null
    });
    geocoder.reverse({ lat: lat, lon: lng }, (err, res) => {
      if (err) {
        console.log(err);
      } else {
        this.setState({clickedCity: res[0].city, clickedCountry: res[0].country})
      }
    })
  }
  onClick({ lat, lng }) {
    this.getLocation(lat, lng);
  }
  render() {
    return (
      <div className="mapWindow">
        <GoogleMap
          onClick={this.onClick.bind(this)}
          apiKey={"AIzaSyD773VvabcqtdV3xw3MGNpb6mA8SnXq3KU"}
          center={[30.2672, -97.7431]}
          zoom={8}
        />
        <p>{this.state.clickedCity}</p>
        <p>{this.state.clickedCountry}</p>
      </div>
    );
  }
}