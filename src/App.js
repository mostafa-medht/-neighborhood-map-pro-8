import React, { Component } from 'react';
// import Map from './components/Map.js'
// import logo from './logo.svg';
import './App.css';
import LocationList from "./components/LocationList.js";
// import Place from "./components/Place";
import Header from './components/header.js';


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
        locations: require("./components/places.json"), // Get the locations from the JSON file
        map: "",
        infowindow: "",
        prevmarker: ""
    };

    // retain object instance when used in the function
    this.initMap = this.initMap.bind(this);
    this.openInfoWindow = this.openInfoWindow.bind(this);
    this.closeInfoWindow = this.closeInfoWindow.bind(this);
    }
    
    componentDidMount() {
    // Connect the initMap() function within this class to the global window context,
    // so Google Maps can invoke it
    window.initMap = this.initMap;
    // Asynchronously load the Google Maps script, passing in the callback reference
    loadMapJS(
        "https://maps.googleapis.com/maps/api/js?key=AIzaSyD8IcpyHkbGi5SZWHekfDWcCeURioPYgDA&callback=initMap"
    );
    }

    initMap() {
        var self = this;

        var mapview = document.getElementById("map");
        mapview.style.height = window.innerHeight + "px";
        var map = new window.google.maps.Map(mapview, {
            center: { lat: 26.561355, lng: 31.698475 },
            zoom: 13,
            mapTypeControl: false
        });

        var InfoWindow = new window.google.maps.InfoWindow({});

        window.google.maps.event.addListener(InfoWindow, "closeclick", function() {
            self.closeInfoWindow();
        });

        this.setState({
            map: map,
            infowindow: InfoWindow
        });

        window.google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            window.google.maps.event.trigger(map, "resize");
            self.state.map.setCenter(center);
        });

        window.google.maps.event.addListener(map, "click", function() {
            self.closeInfoWindow();
        });

        var locations = [];
        this.state.locations.forEach(function(location) {
            var longname = location.name + " - " + location.type;
            var marker = new window.google.maps.Marker({
            position: new window.google.maps.LatLng(
                location.latitude,
                location.longitude
            ),
            // animation: window.google.maps.Animation.DROP,
            map: map
            });

            marker.addListener("click", function() {
                self.openInfoWindow(marker);
            });

            location.longname = longname;
            location.marker = marker;
            location.display = true;
            locations.push(location);
        });
        this.setState({
            locations: locations
        }); 
    }

    openInfoWindow(marker) {
        this.closeInfoWindow();
        this.state.infowindow.open(this.state.map, marker);
        marker.setAnimation(window.google.maps.Animation.BOUNCE);
        this.setState({
          prevmarker: marker
        });
        this.state.infowindow.setContent("Loading Data...");
        this.state.map.setCenter(marker.getPosition());
        this.state.map.panBy(0, -200);
        this.getMarkerInfo(marker);
    }
  
    handleNavMenuToggle = (event) => {
      //Get PlaceList Nav Menu Bar
      let placesNavMenu = document.querySelector("#places-list")
      placesNavMenu.classList.toggle('open')
      event.stopPropagation();
      this.setState({
        menuHidden: !this.state.menuHidden
      })
     }
/**
   * Retrive the location data from the foursquare api
   */
  getMarkerInfo(marker) {
    var self = this;

    // Add the api keys for foursquare
    var clientId = "WXBMZTIDLPJMWO4OZLPWKXZPFUIKTPOGO0YIV54K5MQ4JPDL";
    var clientSecret = "NAUCASKXAVXLG3QQQHJEH25GDAGVLBBJOG2512AYIF1KYXUH";

    // Build the api endpoint
    var url =
      "https://api.foursquare.com/v2/venues/search?client_id="+clientId +"&client_secret="+clientSecret + "&v=20130815&ll=" +
      marker.getPosition().lat() +
      "," +
      marker.getPosition().lng() +
      "&limit=1";
    fetch(url)
      .then(function(response) {
        if (response.status !== 200) {
          self.state.infowindow.setContent("Sorry data can't be loaded");
          return;
        }

        // Get the text in the response
        response.json().then(function(data) {
          console.log(data);

          var location_data = data.response.venues[0];
          var place = `<h3>${location_data.name}</h3>`;
          var street = `<p>${location_data.location.formattedAddress[0]}</p>`;
          var contact = "";
          if (location_data.contact.phone)
            contact = `<p><small>${location_data.contact.phone}</small></p>`;
          var checkinsCount =
            "<b>Number of CheckIn: </b>" +
            location_data.stats.checkinsCount +
            "<br>";
          var readMore =
            '<a href="https://foursquare.com/v/' +
            location_data.id +
            '" target="_blank">Read More on <b>Foursquare Website</b></a>';
          self.state.infowindow.setContent(
            place + street + contact + checkinsCount + readMore
          );
        });
      })
      .catch(function(err) {
        self.state.infowindow.setContent("Sorry data can't be loaded");
      });
  }

  /**
   * Close the info window previously opened
   *
   * @memberof App
   */
  closeInfoWindow() {
    if (this.state.prevmarker) {
      this.state.prevmarker.setAnimation(null);
    }
    this.setState({
      prevmarker: ""
    });
    this.state.infowindow.close();
  }
  
  render() {
    return (
      <div className="App">
        <Header className="App-header" onMenuClick = {this.handleNavMenuToggle}/>
        <div>
          <div id="places-list" className="nav">
            <LocationList
                  key="100"
                  locations={this.state.locations}
                  openInfoWindow={this.openInfoWindow}
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




/**
 * Load the google maps
 * @param {src} url of the google maps script
 */
function loadMapJS(src) {
  var ref = window.document.getElementsByTagName("script")[0];
  var script = window.document.createElement("script");
  script.src = src;
  script.async = true;
  script.onerror = function() {
    document.write("Google Maps can't be loaded");
  };
  ref.parentNode.insertBefore(script, ref);
}
