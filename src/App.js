import React, { Component } from 'react';
import './App.css';
import LocationsList from "./components/LocationList.js";
import Header from './components/header.js';


class App extends Component {
    state = {
    locations:require('./components/places.json'), // get locations api json object
    map:"",
    largeInfowindow:"",
    isOpen: false,
    previousMarker : ""
  };

  initMap = this.initMap;  

// load async map 
  componentDidMount = ()=>{
    window.initMap = this.initMap;
    var ref = window.document.getElementById("mapsrc");
    ref.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyBfB8UMdS7E9dAIHPW3HzKTkkjsMHg2i0I&callback=initMap";
    ref.async = true;
    ref.onerror = function() {
      document.write("Google Maps can't be loaded");
    };
  }

  // initaialize map 
  initMap = ()=>{
    var self= this ; 

    var showMap = document.getElementById('map');
    showMap.style.height = window.innerHeight + "px";
    var map = new window.google.maps.Map(showMap, {    
      center: { lat: 26.561355, lng: 31.698475 },
      zoom: 13,
      mapTypeControl: false
    });

    var largeInfowindow = new window.google.maps.InfoWindow({});
    // var bounds = new window.google.maps.LatLngBounds();

    window.google.maps.event.addListener(largeInfowindow, "closeclick", function() {
      self.closeInfoWindow();
  });

    this.setState({
      map:map,
      largeInfowindow:largeInfowindow
    });

    var locations = [];
    this.state.locations.forEach(function(location){
      var title = location.name+"-"+location.type ;
      var marker = new window.google.maps.Marker({
        position: new window.google.maps.LatLng(
          location.latitude,
          location.longitude
        ),
        map:map,
        title:title,
        // animation: window.google.maps.Animation.DROP
      });

      location.title = title;
      location.marker = marker;
      location.display = true;
      locations.push(location);
      
      marker.addListener('click', function() {
        self.populateInfoWindow(marker);
      }); 
      
    });

    window.google.maps.event.addListener(map, "click", function() {
      self.closeInfoWindow();
    });

    window.google.maps.event.addDomListener(window, "resize", function() {
      var center = map.getCenter();
      window.google.maps.event.trigger(map, "resize");
      this.state.map.setCenter(center);
    });

    this.setState({
      locations: locations
    });
  }

// making information window function 
  populateInfoWindow = (marker) => {
    // Check to make sure the information window is not already opened on this marker.
    this.closeInfoWindow();    
    this.state.largeInfowindow.open(this.state.map, marker);
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
    this.setState({
      previousMarker : marker
    });
    this.state.largeInfowindow.setContent("Loading Data...");
    this.state.map.setCenter(marker.getPosition());
    this.state.map.panBy(-50, -180);
    this.showMarkerInformation(marker);
    // this.state.largeInfowindow.addListener('closeclick',function(){
    //   this
    // });
  }

  // show marker info function 
  showMarkerInformation = (marker) => {
    var self = this; // to prevent "error : trying to get property of nonobject"

    // this.setState({
    //   isOpen:!this.state.isOpen
    // });

   var api = 
   "https://api.foursquare.com/v2/venues/search?client_id=WXBMZTIDLPJMWO4OZLPWKXZPFUIKTPOGO0YIV54K5MQ4JPDL&client_secret=NAUCASKXAVXLG3QQQHJEH25GDAGVLBBJOG2512AYIF1KYXUH&v=20130815&ll="+marker.getPosition().lat() +"," +
   marker.getPosition().lng() +
   "&limit=1";

   fetch(api)
   .then(function(response){
     if (response.status !== 200){
      self.state.largeInfowindow.setContent("Sorry There is no details :(");
      return response;
    }
    //  return response;

     // get location details 
     response.json()
     .then(function(data){
       console.log(data);

       var locationDetails = data.response.venues[0];
 
       var locName = `<i><h3>${locationDetails.name}</h3></i>`;
       var locStreet = `<i><p>${locationDetails.location.formattedAddress[0]}</p></i0>`;
       var locContact = "";
       if (locationDetails.contact.phone)
        locContact = `<p><small>${locationDetails.contact.phone}</small></p>`;
      var readMore =
      '<a href="https://foursquare.com/v/' +
      locationDetails.id +
      '" target="_blank">For More info<b>on Foursquare Website</b></a>';      
        self.state.largeInfowindow.setContent(
        locName + locStreet + locContact + readMore
      );
     })
   })
  }

// Handle menu

  handleNavMenu = (event) => {
    //Get PlaceList Nav Menu Bar
    let placesNavMenu = document.querySelector("#places-list")
    placesNavMenu.classList.toggle('open')
    event.stopPropagation();
    this.setState({
      menuHidden: !this.state.menuHidden
    })
   }

  // close info window 
  closeInfoWindow = () =>  {
    if (this.state.previousMarker) {
      this.state.previousMarker.setAnimation(null);
    }
    this.setState({
      previousMarker: ""
    });
    this.state.largeInfowindow.close();
  }

  render() {
    return (
      <div className="App">
        <Header className="App-header" onMenuClick = {this.handleNavMenu}/>
        <div>
          <div id="places-list" className="nav">
            <LocationsList
              key="1"
              locations={this.state.locations}
              populateInfoWindow={this.populateInfoWindow}
              closeInfoWindow={this.closeInfoWindow}  
            />
          </div>
        </div>  
          <div id="map" />
      </div>
    );
  }
}

export default App;
