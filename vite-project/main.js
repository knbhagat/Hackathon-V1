// import './style.css'
// import javascriptLogo from './javascript.svg'
// import viteLogo from '/vite.svg'
// import { setupCounter } from './counter.js'

// document.querySelector('#app').innerHTML = `
//   <div>
//     <a href="https://vitejs.dev" target="_blank">
//       <img src="${viteLogo}" class="logo" alt="Vite logo" />
//     </a>
//     <a href="https://developer.mozilla.org/en-US/docs/Web/JavaScript" target="_blank">
//       <img src="${javascriptLogo}" class="logo vanilla" alt="JavaScript logo" />
//     </a>
//     <h1>Hello Vite!</h1>
//     <div class="card">
//       <button id="counter" type="button"></button>
//     </div>
//     <p class="read-the-docs">
//       Click on the Vite logo to learn more
//     </p>
//   </div>
// `
// setupCounter(document.querySelector('#counter'));

require(["esri/config", "esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer"], function(esriConfig, Map, MapView, Graphic, GraphicsLayer) {
  //KRISHAANS STUFF

  /**
   * extracts element by id
   */

  // Gets tabs on the left side-panel
  const homeElement = document.getElementById('home');
  const workElement = document.getElementById('work');
  const placeElement = document.getElementById('places');
  // gets calcite-input-text elements
  const homeAddressElement = document.getElementById('homeAddress');
  const workAddressElement = document.getElementById('workAddress');
  const placeInputElement = document.getElementById('placeInput');
  // gets calcite-slider elements
  const travelTimeEl = document.getElementById('homeSlider');
  const workCommuteTimeEl = document.getElementById('workSlider');
  // gets calcite-combobox elements
  const travelTypeEl = document.getElementById('travelType');

  /**
   * Global variables
   */

  // apiKey
  const apiKey = "AAPTxy8BH1VEsoebNVZXo8HurAc00T0_aCwXYF3_LOJHWBDij15oOhVN95m5PvP3QQqjfdNP8-Pmtaxl2tr524Z5zCSTeXLF2P7FMqEsJaCjf5nI1Rt4RUI6oXjz-D6pj4bZNprcAFP5LwSzTRzSM6odj4tgoXO6PBXgK8lphnbuwkc7BlSg_ciFLfaKHtiRNo4p4Yca9NV5BMSLOGT1SMhRjwBTq5ALOQjUvE_V0U7giaY1BaYtPaOm_XHk5LMg1oK0AT1_DXkFiZ7P";
  // coordinates used for mapping
  let homeX;
  let homeY;
  let workX;
  let workY;
  // text-label inputs
  let homeAddress;
  let workAddress;
  let placeInput;
  // slider inputs
  let travelTime;
  let workCommuteTime;
  // grabs combobox inputs --> defaults to Car
  let travelType = "Car";

  /**
   * For side panels rendering configuration blocks
   */

  // Hides all containers
  function hideAllContainers() {
    homeContainer.classList.add('hidden');
    workContainer.classList.add('hidden');
    placesContainer.classList.add('hidden');
  }

  homeElement.addEventListener('click', () => {
    hideAllContainers();
    homeContainer.classList.remove('hidden');
  });

  workElement.addEventListener('click', () => {
    hideAllContainers();
    workContainer.classList.remove('hidden');
  });

  placeElement.addEventListener('click', () => {
    hideAllContainers();
    placesContainer.classList.remove('hidden');
  });

  /**
   * Grabs text inputs from user
   */

  // Gets Home Address
  homeAddressElement.addEventListener('calciteInputTextChange', function(event) {
    homeAddress = event.target.value;
    if (homeAddress) {
      geocodeHomeAddress(homeAddress);
    } else {
      homeGraphicsLayer.removeAll();
    }
    console.log("place, work, home", placeInput, workAddress, homeAddress);
  });
  // Gets Work Address
  workAddressElement.addEventListener('calciteInputTextChange', function(event) {
    workAddress = event.target.value;
    if (workAddress) {
      geocodeWorkAddress(homeAddress);
    } else {
      workGraphicsLayer.removeAll();
    }
    console.log("place, work, home", placeInput, workAddress, homeAddress);
  });
  // Gets place input
  placeInputElement.addEventListener('calciteInputTextChange', function(event) {
    placeInput = event.target.value;
    console.log("place, work, home", placeInput, workAddress, homeAddress);
  });


  /**
   * Grabs slider inputs from user
   */

  // grabs home slider
  travelTimeEl.addEventListener('calciteSliderChange', function(event) {
    travelTime = event.target.value;
    console.log("travelTime, workCommuteTime", travelTime, workCommuteTime)
  });
  // grabs work slider
  workCommuteTimeEl.addEventListener('calciteSliderChange', function(event) {
    workCommuteTime = event.target.value;
    console.log("travelTime, workCommuteTime", travelTime, workCommuteTime);
  });

  /**
   * Grabs combobox info from user
   */

  // grabs home travel type
  travelTypeEl.addEventListener('calciteComboboxChange', function(event) {
    const val = event.target.value;
    travelType = val;
    console.log("travelType", travelType);
  });

  /////aniket


  /**
  * Mapping functions
  */
  function geocodeHomeAddress(){
    const geocodedUrl= `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${homeAddress}&category=&outFields=*&forStorage=false&f=pjson&token=${apiKey}`;
    fetch(geocodedUrl)
      .then(function(response) {
        if (!response.ok) {
          throw new Error('Network response was not ok ' + response.statusText);
        }
        return response.json();
      })
      .then(function(data) {
        // Handle the response data
        console.log("Geocode response: ", data);
        homeX = data.candidates[0].location.x;
        homeY = data.candidates[0].location.y;
        addHomeCoordinate()
      })
      .catch(function(error) {
        // Handle any errors
        console.error("Error occurred: ", error);
      });
    //console.log(geocodedresponse)
    //https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses?/<PARAMETERS>
  }


  function geocodeWorkAddress(){
    console.log("Work address API response")
    const geocodedUrlwork= `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${workAddress}&category=&outFields=*&forStorage=false&f=pjson&token=${apiKey}`;
    fetch(geocodedUrlwork)
      .then(function(responsew) {
        if (!responsew.ok) {
          throw new Error('Network response was not ok ' + responsew.statusText);
        }
        return responsew.json();
      })
      .then(function(dataw) {
        // Handle the response data
        console.log("Geocode response for work addy: ", dataw);
        workX = dataw.candidates[0].location.x;
        workY = dataw.candidates[0].location.y;
        addWorkCoordinate()
      })
      .catch(function(error) {
        // Handle any errors
        console.error("Error occurred: ", error);
      });


  }

  esriConfig.apiKey = apiKey;

  const map = new Map({
    basemap: "arcgis/topographic" // basemap styles service
  });
  // initialization of map
  let view = new MapView({
    map: map,
    center: [-95.7129, 37.0902], // Longitude, latitude
    zoom: 5, // Zoom level
    container: "aniket-trial-map" // Div element
  });
  
  const homeGraphicsLayer = new GraphicsLayer();
  const workGraphicsLayer = new GraphicsLayer();
  map.add(homeGraphicsLayer);
  map.add(workGraphicsLayer);

  /**
   * functions to modify map zoom
   */
  function changeView() {
      // only home coordinates
    if (!workX && !workY) {
      view.goTo({
        center: [homeX, homeY],
        zoom: 11,
      });
      // only work coordinates
    } else if (!homeX && !homeY) {
      view.goTo({
        center: [workX, workY],
        zoom: 11,
      });
      // both work and home coordinates
    } else {
      const midLatitude = (homeX + workX) / 2;
      const midLongitude = (homeY + workY) / 2;
      view.goTo({
        center: [midLatitude, midLongitude],
        zoom: 10,
      });
    }
  }

  // NEED TO ADD LOGIC TO DELETE A POINT
  function addHomeCoordinate() {
    if (homeX && homeY) {
      homeGraphicsLayer.removeAll()
      // Maybe add something right here to clear 
      const point = { //Create a point
        type: "point",
        longitude: homeX,
        latitude: homeY,
      };
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  // Orange
        outline: {
            color: [255, 255, 255], // White
            width: 1,
        }
      };
      const pointGraphic = new Graphic({
        geometry: point,
        symbol: simpleMarkerSymbol
      });
      // adds layer and recenters view
      homeGraphicsLayer.add(pointGraphic);
      changeView();
    }
  }

  function addWorkCoordinate() {
    if (workX && workY) {
      workGraphicsLayer.removeAll();
      const pointw = { //Create a point
        type: "point",
        longitude: workX,
        latitude: workY,
      };
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [226, 119, 40],  // Orange
        outline: {
            color: [255, 255, 255], // White
            width: 1,
        }
      };
      const pointGraphic = new Graphic({
        geometry: pointw,
        symbol: simpleMarkerSymbol
      });
      // adds layer and recenters view
      workGraphicsLayer.add(pointGraphic);
      changeView();
    }
  }
})
