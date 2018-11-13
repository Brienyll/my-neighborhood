import React, { Component } from 'react'
import './App.css'
import axios from 'axios'

class App extends Component {


  state = {
    venues: []
  }

  componentDidMount() {
    this.getVenues()
  }

  renderMap = () => {
    loadScript("https://maps.googleapis.com/maps/api/js?key=AIzaSyB5MHH_R_P6olSWXk_9HqY95UKXQEoM2F0&callback=initMap")
    window.initMap = this.initMap
  }

  getVenues = () => {
    const endPoint = "https://api.foursquare.com/v2/venues/explore?"
    const parameters = {
      client_id: "XDCZGRCXDDRVNUUHWKXU2NAJLBACIQLVZ5JB0QPHGIVUEJCQ",
      client_secret: "IELUQVDPLTUQACEWDBOQAFOUKJLJVCCMMS4WGDOXI0IV5CNR",
      query: "food",
      near: "Panorama City, CA",
      v: "20182507"
    }

    axios.get(endPoint + new URLSearchParams(parameters))
      .then(response => {
        this.setState({
          venues: response.data.response.groups[0].items
        }, this.renderMap())
      })
      .catch(error => {
        console.log("ERROR!! " + error)
      })

  }
  initMap = () => {

    // display google map
    let map = new window.google.maps.Map(document.getElementById("map"), {
      //set ll
      center: { lat: 34.2276, lng: -118.4424 },
      //zoom level, the higher the close
      zoom: 15
    });
  
    this.map = map;
  
    // infowondow
    let infowindow = new window.google.maps.InfoWindow();
    
    const allMarkers = [];
    this.setState({
      map: map,
      infowindow: infowindow
    });
  
    this.state.venues.forEach(myvenue => {
      // getters
      let contentString = `${myvenue.venue.name +
        ", " +
        myvenue.venue.location.city + ", "+ myvenue.venue.location.address}`;
      
        //markers
      let marker = new window.google.maps.Marker({
        position: { 
          lat: myvenue.venue.location.lat,
          lng: myvenue.venue.location.lng
        },
        map: map,
        city:myvenue.venue.location.city,
        address: myvenue.venue.location.address,
        myvenue: myvenue,      
        id: myvenue.venue.id,
        name: myvenue.venue.name,
        draggable: true,
        animation: window.google.maps.Animation.DROP,
        title: myvenue.venue.name
      });
  
      marker.addListener("click", function() {
        if (marker.getAnimation() != null) {
          marker.setAnimation(null);
        } else {
          marker.setAnimation(window.google.maps.Animation.BOUNCE);
        }
        setTimeout(() => {
          marker.setAnimation(null);
        }, 1500);
  
        infowindow.setContent(contentString);
  
        infowindow.open(map, marker);
      });
      allMarkers.push(marker);
    });
  
    this.setState({
      markers: allMarkers
    });
    this.setState({ filtermyvenue: this.state.venues });
  };
  
  constructor(props) {
    super(props);
    this.state = {
      query: ""
    };
  }
  
  
  listItemClick = (venues) => {
    let marker = this.state.markers.filter(m => m.id === venues.id)[0];
    this.state.infowindow.setContent(`${marker.name +
      ", " +
    marker.city + ", " + marker.address}`);
  
    this.map.setCenter(marker.position);
    this.state.infowindow.open(this.state.map, marker);
    console.log(marker);
  if (marker.getAnimation() != null) {
    marker.setAnimation(null);
  } else {
    marker.setAnimation(window.google.maps.Animation.BOUNCE);
  }
  setTimeout(() => {
    marker.setAnimation(null);
  }, 1500);
  }

  filtermyvenue(query) {
    let f = this.state.venues.filter(myvenue => myvenue.venue.name.toLowerCase().includes(query.toLowerCase()))
    console.log(this.state);
    //show window 
    this.state.markers.forEach(marker => {
      marker.name.toLowerCase().includes(query.toLowerCase()) === true ?
      marker.setVisible(true) :
      marker.setVisible(false);
    });
    // check if length is 0
    if (f.length === 0) {
      // close
      this.state.infowindow.close();   
    }
    //Set the state to reflect the query
    this.setState({filtermyvenue: f, query}); 
  }
  
    render() {
      return (  
        <main>
          {/* aria label */}      
        <div role="application" aria-label="map" id='map'></div>
        {/*sidebar */}
        <div aria-label="sidebar" id='sidebar'>
        {/*header*/}
        <div className="header">Restaurants - Panorama, CA</div>
        {/*input field*/}
        <input type="text" autoFocus="autofocus" tabIndex="0" className="SearchVenues" placeholder="Search restaurants" value={this.state.query} onChange={(e)=>{this.filtermyvenue(e.target.value)}}/>
        <br/>
        <br/>
        {
          this.state.filtermyvenue && this.state.filtermyvenue.length > 0 && this.state.filtermyvenue.map((myvenue, index) => (
              <div tabIndex="-1" key={index} className="venue-item">
                  
                  <button onClick={()=>{this.listItemClick(myvenue.venue)}}>{myvenue.venue.name}</button>
              </div>
          ))
        }
        </div>
        </main>      
      )
    }
  }
  
  function loadScript(source) {
    try {
      //adding try catch block to make sure if script doesnt work it gives proper console and alert
      //select script tag
      var index = window.document.getElementsByTagName('script')[0]
      var script = window.document.createElement('script')
      script.src = source
      script.async = true
      script.defer = true
      index.parentNode.insertBefore(script, index)
     } catch (error) {
      console.log(error);
      //alert for user if it doesnt work
     alert("Sorry, That didn't work. Check console for more details");
     }
    }
  
  export default App;