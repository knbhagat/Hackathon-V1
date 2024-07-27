

require(["esri/config", "esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer", "esri/rest/serviceArea",
  "esri/rest/support/ServiceAreaParameters",
  "esri/rest/support/FeatureSet",], function(esriConfig, Map, MapView, Graphic, GraphicsLayer, serviceArea, ServiceAreaParams, FeatureSet) {


  // Put all API config at start
  // apiKey
  const apiKey = "AAPTxy8BH1VEsoebNVZXo8HurAc00T0_aCwXYF3_LOJHWBDij15oOhVN95m5PvP3QQqjfdNP8-Pmtaxl2tr524Z5zCSTeXLF2P7FMqEsJaCjf5nI1Rt4RUI6oXjz-D6pj4bZNprcAFP5LwSzTRzSM6odj4tgoXO6PBXgK8lphnbuwkc7BlSg_ciFLfaKHtiRNo4p4Yca9NV5BMSLOGT1SMhRjwBTq5ALOQjUvE_V0U7giaY1BaYtPaOm_XHk5LMg1oK0AT1_DXkFiZ7P";

  esriConfig.apiKey = apiKey;

  const map = new Map({
    basemap: "arcgis/human-geography-dark" // basemap styles service
  });

  const view = new MapView({
    map: map,
    center: [-88.7129, 37.0902], // Longitude, latitude
    scale: 12500000, // Zoom level
    container: "aniket-trial-map" // Div element
  });

  const serviceAreaUrl = "https://route-api.arcgis.com/arcgis/rest/services/World/ServiceAreas/NAServer/ServiceArea_World/solveServiceArea";


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
  const homeTravelTypeEl = document.getElementById('homeTravelType');
  const workTravelTypeEl = document.getElementById('workTravelType');
  // gets reset calcite-button
  const homeResetEl = document.getElementById('resetHome');
  const workResetEl = document.getElementById('resetWork');
  // gets run calcite burron
  const homeRunEl = document.getElementById('runHome');
  const workRunEl = document.getElementById('runWork');


  /**
   * Global variables
   */

  
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
  let travelTime = travelTimeEl.value;
  let workCommuteTime = workCommuteTimeEl.value;
  // grabs combobox inputs --> defaults to Car
  let homeTravelType = homeTravelTypeEl.value;
  let workTravelType = workTravelTypeEl.value;

  

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
    console.log("place, work, home", placeInput, workAddress, homeAddress);
  });
  // Gets Work Address
  workAddressElement.addEventListener('calciteInputTextChange', function(event) {
    workAddress = event.target.value;
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
    // plotHomeServiceArea()
    console.log("travelTime, workCommuteTime", travelTime, workCommuteTime);
  });
  // grabs work slider
  workCommuteTimeEl.addEventListener('calciteSliderChange', function(event) {
    workCommuteTime = event.target.value;
    // create service area()
    console.log("travelTime, workCommuteTime", travelTime, workCommuteTime);
  });

  /**
   * Grabs combobox info from user
   */

  // grabs home travel type
  homeTravelTypeEl.addEventListener('calciteComboboxChange', function(event) {
    const val = event.target.value;
    homeTravelType = val;
    console.log("home and work travel type", homeTravelType, workTravelType);
  });

  // grabs work travel type
  workTravelTypeEl.addEventListener('calciteComboboxChange', function(event) {
    const val = event.target.value;
    workTravelType = val;
    console.log("home and work travel type", homeTravelType, workTravelType);
  })

  /**
   * implements button logic
   */

  // reset home button logic
  homeResetEl.addEventListener('click', function() {
    console.log("hit")
    // reset to graphics layer
    homeGraphicsLayer.removeAll();
    // reseting logic
    homeAddressElement.value = '';
    homeAddress = undefined;
    homeTravelTypeEl.value = "Driving";
    homeTravelType = "Driving";
    travelTimeEl.value = 30;
    travelTime = 30;
  });
  // reset work button logic
  workResetEl.addEventListener('click', function() {
    console.log("hit")
    // reset to graphics layer
    workGraphicsLayer.removeAll();
    // reseting logic
    workAddressElement.value = '';
    workAddress = undefined;
    workTravelTypeEl.value = "Driving";
    workTravelType = "Driving";
    workCommuteTimeEl.value = 30;
    workCommuteTime = 30;
  });
  // run home button logic
  homeRunEl.addEventListener('click', function() {
    console.log("hit");
    geocodeHomeAddress();
  })
  workRunEl.addEventListener('click', function() {
    console.log("hit");
    geocodeWorkAddress();
  })

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
        homeX = data.candidates[0]?.location.x;
        homeY = data.candidates[0]?.location.y;
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
        workX = dataw.candidates[0]?.location.x;
        workY = dataw.candidates[0]?.location.y;
        addWorkCoordinate()
      })
      .catch(function(error) {
        // Handle any errors
        console.error("Error occurred: ", error);
      });


  }


  const homeGraphicsLayer = new GraphicsLayer();
  const workGraphicsLayer = new GraphicsLayer();
  workGraphicsLayer.effect = "drop-shadow(3px, 3px, 4px)"
  homeGraphicsLayer.effect = "drop-shadow(3px, 3px, 4px)"
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
        zoom: 10,
      });
      // only work coordinates
    } else if (!homeX && !homeY) {
      view.goTo({
        center: [workX, workY],
        zoom: 10,
      });
      // both work and home coordinates
    } else {
      const midLatitude = (homeX + workX) / 2;
      const midLongitude = (homeY + workY) / 2;
      view.goTo({
        center: [midLatitude, midLongitude],
        zoom: 9,
      });
    }
  }

  // NEED TO ADD LOGIC TO DELETE A POINT
  function addHomeCoordinate() {
    if (homeX && homeY) {
      homeGraphicsLayer.removeAll()
      // Maybe add something right here to clear 
      const homePoint = { //Create a point
        type: "point",
        longitude: homeX,
        latitude: homeY,
      };
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [0, 222, 166],  // Mint Green
        outline: {
            color: [255, 255, 255], // White
            width: 1,
        }
      };
      const pointGraphic = new Graphic({
        geometry: homePoint,
        symbol: simpleMarkerSymbol
      });

      // adds layer and recenters view
      homeGraphicsLayer.add(pointGraphic);

      
      const homeServiceAreaParams = (createServiceAreaParams(pointGraphic, travelTime, view.SpatialReference))
      const homeServiceArea = solveServiceArea(serviceAreaUrl, homeServiceAreaParams, homeGraphicsLayer, [0, 222, 166, 0.4])

      // homeGraphicsLayer.add(polygonGraphic)
      changeView();
    }
  }

  function addWorkCoordinate() {
    if (workX && workY) {
      workGraphicsLayer.removeAll();

      const workPoint = { //Create a point
        type: "point",
        longitude: workX,
        latitude: workY,
      };
      const simpleMarkerSymbol = {
        type: "simple-marker",
        color: [0, 222, 166],  // Mint Green
        outline: {
            color: [255, 255, 255], // White
            width: 1,
        }
      };
      const pointGraphic = new Graphic({
        geometry: workPoint,
        symbol: simpleMarkerSymbol
      });
      // adds layer and recenters view
      workGraphicsLayer.add(pointGraphic);

      const workServiceAreaParams = (createServiceAreaParams(pointGraphic, workCommuteTime, view.SpatialReference))
      solveServiceArea(serviceAreaUrl, workServiceAreaParams, workGraphicsLayer, [0, 222, 166, 0.4] )

      changeView();
    }
  }

  // Creates parameters for service area function call
  function createServiceAreaParams(locationGraphic, driveTimeCutoff, outSpatialReference) {
    const featureSet = new FeatureSet({
      features: [locationGraphic]
    })
    
    const taskParameters = new ServiceAreaParams({
      facilities: featureSet,
      defaultBreaks: driveTimeCutoff,
      trimOuterPolygon: true,
      outSpatialReference: outSpatialReference
    });
    return taskParameters;
  }

  // Creates service area polygon and returns graphic layer
  function solveServiceArea(url, serviceAreaParams, currentGraphicsLayer, color) {
    return serviceArea.solve(url, serviceAreaParams)
      .then(function(result){
        if (result.serviceAreaPolygons.features.length) {
          currentGraphicsLayer.removeAll()
          // Draw each service area polygon
          result.serviceAreaPolygons.features.forEach(function(graphic){
            graphic.symbol = {
              type: "simple-fill",
              color: color
            }
            currentGraphicsLayer.add(graphic,0);
          });
        }
      }, function(error){
        console.log(error);
      });
  }
})
