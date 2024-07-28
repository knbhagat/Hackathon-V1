

require(["esri/config", "esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer", "esri/rest/serviceArea",
  "esri/rest/support/ServiceAreaParameters",
  "esri/rest/support/FeatureSet", "esri/geometry/geometryEngine"], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, serviceArea, ServiceAreaParams, FeatureSet, geometryEngine) {


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

  // Object to hold geometries before calculating intersection
  let serviceAreaGeometries = {}
  let homeServiceAreaParams;
  let workServiceAreaParams;
  let customServiceAreaParams;

    //KRISHAANS STUFF

    /**
     * extracts element by id
     */

    // Gets tabs on the left side-panel
    const homeElement = document.getElementById('home');
    const workElement = document.getElementById('work');
    // const placeElement = document.getElementById('places');
    const customElement = document.getElementById('custom');
    const infoElement = document.getElementById('info');
    // gets calcite blocks
    const homeContainer = document.getElementById('homeContainer');
    const workContainer = document.getElementById('workContainer');
    const customContainer = document.getElementById('customContainer');
    const placesContainer = document.getElementById('placesContainer');
    // gets calcite-input-text elements
    const homeAddressElement = document.getElementById('homeAddress');
    const workAddressElement = document.getElementById('workAddress');
    const customAddressElement = document.getElementById('customAddress');
    const placeInputElement = document.getElementById('placeInput');
    // gets calcite-slider elements
    const travelTimeEl = document.getElementById('homeSlider');
    const workCommuteTimeEl = document.getElementById('workSlider');
    const customTimeEl = document.getElementById('customSlider')
    // gets calcite-combobox elements
    const homeTravelTypeEl = document.getElementById('homeTravelType');
    const workTravelTypeEl = document.getElementById('workTravelType');
    const customTravelTypeEl = document.getElementById('customTravelType')
    // gets reset calcite-button
    const homeResetEl = document.getElementById('resetHome');
    const workResetEl = document.getElementById('resetWork');
    const customResetEl = document.getElementById('resetCustom')
    // gets run calcite button
    const homeRunEl = document.getElementById('runHome');
    const workRunEl = document.getElementById('runWork');
    const customRunEl = document.getElementById('runCustom')
    // gets valid address message
    const valHomeAddressEl = document.getElementById("validHomeAddress");
    const valWorkAddressEl = document.getElementById("validWorkAddress");
    const valCustomAddressEl = document.getElementById("validCustomAddress");

    const sheet = document.getElementById("example-sheet");
    const modal = document.getElementById("infomodal");

    /**
     * Global variables
     */


    // coordinates used for mapping
    let homeX;
    let homeY;
    let workX;
    let workY;
    let customX;
    let customY;
    // text-label inputs
    let homeAddress;
    let workAddress;
    let customAddress;
    let placeInput;
    // slider inputs
    let travelTime = travelTimeEl.value;
    let workCommuteTime = workCommuteTimeEl.value;
    let customTime = customTimeEl.value;
    // grabs combobox inputs --> defaults to Car
    let homeTravelType = homeTravelTypeEl.value;
    let workTravelType = workTravelTypeEl.value;
    let customTravelType = customTravelTypeEl.value;
    // intersect xoords
    let intersectLat;
    let intersectLong;
    let intersect;



    /**
     * For side panels rendering configuration blocks
     */

    // Hides all containers
    function hideAllContainers() {
      homeContainer.classList.add('hidden');
      workContainer.classList.add('hidden');
      placesContainer.classList.add('hidden');
      customContainer.classList.add('hidden');
    }

    homeElement.addEventListener('click', () => {
      hideAllContainers();
      homeContainer.classList.remove('hidden');
    });

    workElement.addEventListener('click', () => {
      hideAllContainers();
      workContainer.classList.remove('hidden');
    });

    // placeElement.addEventListener('click', () => {
    //   hideAllContainers();
    //   placesContainer.classList.remove('hidden');
    // });

    customElement.addEventListener('click', () => {
      hideAllContainers();
      customContainer.classList.remove('hidden');
    });

    infoElement.addEventListener('click', () => {
      loadInfoGraphic();
    });

    /**
     * Grabs text inputs from user
     */

    // Gets Home Address
    homeAddressElement.addEventListener('calciteInputTextChange', function (event) {
      homeAddress = event.target.value;
      // adds message
      if (homeAddress) {
        valHomeAddressEl.icon = "check";
        valHomeAddressEl.status = "valid";
        valHomeAddressEl.innerText = "Place added on map!";
      } else {
        valHomeAddressEl.icon = "x";
        valHomeAddressEl.status = "invalid"
        valHomeAddressEl.innerText = "Invalid address!";
      }
      console.log("place, work, home, custom", placeInput, workAddress, homeAddress, customAddress);
    });
    // Gets Work Address
    workAddressElement.addEventListener('calciteInputTextChange', function (event) {
      workAddress = event.target.value;
      if (workAddress) {
        valWorkAddressEl.icon = "check";
        valWorkAddressEl.status = "valid";
        valWorkAddressEl.innerText = "Place added on map!";
      } else {
        valWorkAddressEl.icon = "x";
        valWorkAddressEl.status = "invalid"
        valWorkAddressEl.innerText = "Invalid address";
      }
      console.log("place, work, home, custom", placeInput, workAddress, homeAddress, customAddress);
    });
    // Get Custom Address
    customAddressElement.addEventListener('calciteInputTextChange', function (event) {
      customAddress = event.target.value;
      if (customAddress) {
        valCustomAddressEl.icon = "check";
        valCustomAddressEl.status = "valid";
        valCustomAddressEl.innerText = "Place added on map!";
      } else {
        valCustomAddressEl.icon = "x";
        valCustomAddressEl.status = "invalid"
        valCustomAddressEl.innerText = "Invalid address";
      }
      console.log("place, work, home, custom", placeInput, workAddress, homeAddress, customAddress);
    });
    // Gets place input
    placeInputElement.addEventListener('calciteInputTextChange', function (event) {
      placeInput = event.target.value;
      console.log("place, work, home, custom", placeInput, workAddress, homeAddress, customAddress);
    });

    /**
     * Grabs slider inputs from user
     */

    // grabs home slider
    travelTimeEl.addEventListener('calciteSliderChange', function (event) {
      travelTime = event.target.value;
      console.log("travelTime, workCommuteTime, customTime", travelTime, workCommuteTime, customTime);
    });
    // grabs work slider
    workCommuteTimeEl.addEventListener('calciteSliderChange', function (event) {
      workCommuteTime = event.target.value;
      console.log("travelTime, workCommuteTime, customTime", travelTime, workCommuteTime, customTime);
    });
    // grabs custom slider
    customTimeEl.addEventListener('calciteSliderChange', function (event) {
      customTime = event.target.value;
      console.log("travelTime, workCommuteTime, customTime", travelTime, workCommuteTime, customTime);
    });

    /**
     * Grabs combobox info from user
     */
    // grabs home travel type
    homeTravelTypeEl.addEventListener('calciteComboboxChange', function (event) {
      const val = event.target.value;
      homeTravelType = val;
      console.log("home travel type", homeTravelType);
    });

    // grabs work travel type
    workTravelTypeEl.addEventListener('calciteComboboxChange', function (event) {
      const val = event.target.value;
      workTravelType = val;
      // if (workTravelType == "Walking")
      // console.log("work travel type", workTravelType);
    })

    // grabs custom travel typ
    customTravelTypeEl.addEventListener('calciteComboboxChange', function (event) {
      const val = event.target.value;
      customTravelType = val;
      console.log("custom travel type", customTravelType);
    })

    /**
     * Travel Mode JSON Objects
    */
    const walkingTravelMode = {
      "attributeParameterValues": [],
      "description": "Walking Time",
      "distanceAttributeName": "WalkTime",
      "id": "caFAwlk",
      "impedanceAttributeName": "WalkTime",
      "name": "Walking Time",
      "restrictions": ["Avoid Private Roads", "Avoid Unpaved Roads"],
      "simplificationTolerance": 2,
      "simplificationToleranceUnits": "meters",
      "type": "walk"
    };

    
    /**
     * implements button logic
     */

  // reset home button logic
  homeResetEl.addEventListener('click', function() {
    console.log("hit")
    // removes work address from serviceAreaGeometriesObject
    // clears graphics layer for home service area
    homeGraphicsLayer.removeAll();
    // clears graphics layer for intersection
    intersectGraphicsLayer.removeAll();
    delete serviceAreaGeometries.homeGeometry;
    // reseting logic
    homeAddressElement.value = '';
    homeAddress = undefined;
    homeTravelTypeEl.value = "Driving";
    homeTravelType = "Driving";
    travelTimeEl.value = 30;
    travelTime = 30;
    homeX = undefined;
    homeY = undefined;
    if (workX && workY && customX && customY) {
      solveServiceArea(serviceAreaUrl, workServiceAreaParams, workGraphicsLayer, workGraphicColor);
    }
  });
  // reset work button logic
  workResetEl.addEventListener('click', function() {
    console.log("hit")
    // clears graphics layer for work service area
    workGraphicsLayer.removeAll();
    // clears graphics layer for intersection
    intersectGraphicsLayer.removeAll();
    // removes work address from serviceAreaGeometriesObject
    delete serviceAreaGeometries.workGeometry;
    console.log(serviceAreaGeometries);

    // reseting logic
    workAddressElement.value = '';
    workAddress = undefined;
    workTravelTypeEl.value = "Driving";
    workTravelType = "Driving";
    workCommuteTimeEl.value = 30;
    workCommuteTime = 30;
    workX = undefined;
    workY = undefined;
    if (customX && customY && homeX && homeY) {
      solveServiceArea(serviceAreaUrl, homeServiceAreaParams, homeGraphicsLayer, homeGraphicColor);
    }
  });
  // reset custom button logic
  customResetEl.addEventListener('click', function() {
    // reset to graphics layer
    customGraphicsLayer.removeAll();
    // clears graphics layer for intersection
    intersectGraphicsLayer.removeAll();
    // removes custom address from serviceAreaGeometriesObject
    delete serviceAreaGeometries.customGeometry;
    // reseting logic
    customAddressElement.value = '';
    customAddress = undefined;
    customTravelTypeEl.value = "Driving";
    customTravelType = "Driving";
    customTimeEl.value = 30;
    customTime = 30;
    customX = undefined;
    customY = undefined;

    if (workX && workY && homeX && homeY) {
      solveServiceArea(serviceAreaUrl, workServiceAreaParams, workGraphicsLayer, workGraphicColor);
    }

  });
  // run home button logic
  homeRunEl.addEventListener('click', function() {
    console.log("hit");
    intersectGraphicsLayer.removeAll();
    geocodeHomeAddress();
  })
  workRunEl.addEventListener('click', function() {
    console.log("hit");
    intersectGraphicsLayer.removeAll();
    geocodeWorkAddress();
  })
  customRunEl.addEventListener('click', function() {
    console.log("hit");
    intersectGraphicsLayer.removeAll();
    geocodeCustomAddress();
  })


    /**
    * Mapping functions
    */
    function geocodeHomeAddress() {
      const geocodedUrl = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${homeAddress}&category=&outFields=*&forStorage=false&f=pjson&token=${apiKey}`;
      fetch(geocodedUrl)
        .then(function (response) {
          if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
          }
          return response.json();
        })
        .then(function (data) {
          // Handle the response data
          console.log("Geocode response: ", data);
          homeX = data.candidates[0]?.location.x;
          homeY = data.candidates[0]?.location.y;
          addHomeCoordinate()
        })
        .catch(function (error) {
          // Handle any errors
          console.error("Error occurred: ", error);
        });
      //console.log(geocodedresponse)
      //https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/geocodeAddresses?/<PARAMETERS>
    }


    function geocodeWorkAddress() {
      console.log("Work address API response")
      const geocodedUrlwork = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${workAddress}&category=&outFields=*&forStorage=false&f=pjson&token=${apiKey}`;
      fetch(geocodedUrlwork)
        .then(function (responsew) {
          if (!responsew.ok) {
            throw new Error('Network response was not ok ' + responsew.statusText);
          }
          return responsew.json();
        })
        .then(function (dataw) {
          // Handle the response data
          console.log("Geocode response for work addy: ", dataw);
          workX = dataw.candidates[0]?.location.x;
          workY = dataw.candidates[0]?.location.y;
          addWorkCoordinate()
        })
        .catch(function (error) {
          // Handle any errors
          console.error("Error occurred: ", error);
        });
    }

    function geocodeCustomAddress() {
      console.log("Custom address API response")
      const geocodedUrlwork = `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${customAddress}&category=&outFields=*&forStorage=false&f=pjson&token=${apiKey}`;
      fetch(geocodedUrlwork)
        .then(function (responsec) {
          if (!responsec.ok) {
            throw new Error('Network response was not ok ' + responsec.statusText);
          }
          return responsec.json();
        })
        .then(function (datac) {
          // Handle the response data
          console.log("Geocode response for work addy: ", datac);
          customX = datac.candidates[0]?.location.x;
          customY = datac.candidates[0]?.location.y;
          addCustomCoordinate()
        })
        .catch(function (error) {
          // Handle any errors
          console.error("Error occurred: ", error);
        });
    }

  // Graphics layers for home, work, and intersection
  const homeGraphicsLayer = new GraphicsLayer();
  const homeGraphicColor = [0, 222, 166, 0.4];
  const workGraphicsLayer = new GraphicsLayer();
  const workGraphicColor = [66, 135, 245, 0.5];
  const customGraphicsLayer = new GraphicsLayer();
  const customGraphicColor = [0, 222, 166, 0.4];
  const intersectGraphicsLayer = new GraphicsLayer();
  workGraphicsLayer.effect = "drop-shadow(3px, 3px, 4px)";
  homeGraphicsLayer.effect = "drop-shadow(3px, 3px, 4px)";
  customGraphicsLayer.effect = "drop-shadow(3px, 3px, 4px)";
  map.add(homeGraphicsLayer);
  map.add(workGraphicsLayer);
  map.add(customGraphicsLayer);


    /**
     * functions to modify map zoom
     */
    function changeView() {
      if (workX && workY && homeX && homeY && customX && customY) {
        const midLatitude = (homeX + workX + customX) / 3;
        const midLongitude = (homeY + workY + customY) / 3;
        view.goTo({
          center: [midLatitude, midLongitude],
          zoom: 7,
        });
        // no custom
      } else if (homeX && homeY && workX && workY) {
        const midLatitude = (homeX + workX) / 2;
        const midLongitude = (homeY + workY) / 2;
        view.goTo({
          center: [midLatitude, midLongitude],
          zoom: 8,
        });
        // no work
      } else if (homeX && homeY && customX && customY) {
        const midLatitude = (homeX + customX) / 2;
        const midLongitude = (homeY + customY) / 2;
        view.goTo({
          center: [midLatitude, midLongitude],
          zoom: 8,
        });
        // no home
      } else if (workX && workY && customX && customY) {
        const midLatitude = (workX + customX) / 2;
        const midLongitude = (workY + customY) / 2;
        view.goTo({
          center: [midLatitude, midLongitude],
          zoom: 8,
        });
        // only home
      } else if (homeX && homeY) {
        view.goTo({
          center: [homeX, homeY],
          zoom: 9,
        });
        // only work
      } else if (workX && workY) {
        view.goTo({
          center: [workX, workY],
          zoom: 9,
        });
        // only custom
      } else if (customX && customY) {
        view.goTo({
          center: [customX, customY],
          zoom: 9,
        });
        // should never hit
      } else {
        console.error("No valid coordinates provided.");
      }
    }

    // NEED TO ADD LOGIC TO DELETE A POINT
    function addHomeCoordinate() {
      if (homeX && homeY) {
        console.log("hit home");
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
        // Service area for home address
        homeServiceAreaParams = (createServiceAreaParams(pointGraphic, travelTime, view.SpatialReference))
        solveServiceArea(serviceAreaUrl, homeServiceAreaParams, homeGraphicsLayer, homeGraphicColor, 'home');
        changeView();
      }
    }

    // NEED TO ADD LOGIC TO DELETE A POINT
    function addCustomCoordinate() {
      if (customX && customY) {
        console.log("hit custom");
        customGraphicsLayer.removeAll()
        // Maybe add something right here to clear 
        const customPoint = { //Create a point
          type: "point",
          longitude: customX,
          latitude: customY,
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
          geometry: customPoint,
          symbol: simpleMarkerSymbol
        });

        // adds layer and recenters view
        customGraphicsLayer.add(pointGraphic);
        customServiceAreaParams = (createServiceAreaParams(pointGraphic, customTime, view.SpatialReference))
        solveServiceArea(serviceAreaUrl, customServiceAreaParams, customGraphicsLayer, customGraphicColor, 'custom')
        changeView();
    }
  }


    function addWorkCoordinate() {
      if (workX && workY) {
        console.log("hit work")
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
        // Service area for work address
        workServiceAreaParams = (createServiceAreaParams(pointGraphic, workCommuteTime, view.SpatialReference));
        solveServiceArea(serviceAreaUrl, workServiceAreaParams, workGraphicsLayer, [66, 135, 245, 0.5], 'work' );
        changeView();
      }
    }

    // Creates parameters for service area function call
    function createServiceAreaParams(locationGraphic, driveTimeCutoff, outSpatialReference, travelType) {
      const featureSet = new FeatureSet({
        features: [locationGraphic]
      })

      const taskParameters = new ServiceAreaParams({
        facilities: featureSet,
        defaultBreaks: driveTimeCutoff,
        trimOuterPolygon: true,
        outSpatialReference: outSpatialReference
      });

      if(travelType == "Walking" ){
        taskParameters.travelMode = walkingTravelMode
      }

      return taskParameters;
    }

  // Creates service area polygon and returns graphic layer
  function solveServiceArea(url, serviceAreaParams, currentGraphicsLayer, color, type) {
    return serviceArea.solve(url, serviceAreaParams)
      .then(function(result) {
        if (result.serviceAreaPolygons.features.length) {
          currentGraphicsLayer.removeAll()

          // logic to properly assign home vs work elements of service area geometries
          if (type) {
            type === 'home' ? serviceAreaGeometries.homeGeometry = result.serviceAreaPolygons.features[0].geometry
            : type === 'work' ? serviceAreaGeometries.workGeometry = result.serviceAreaPolygons.features[0].geometry
            : serviceAreaGeometries.customGeometry = result.serviceAreaPolygons.features[0].geometry
          }
          mapInsertPolygon(result, currentGraphicsLayer, color)
        }
      }, function(error){
        console.log(error);
      });
    }


  function mapInsertPolygon(result, currentGraphicsLayer, color) {
    // run intersection tool only if if there are two/three service area geometry elements
    if (Object.keys(serviceAreaGeometries).length >= 2) {
      console.log('serviceAreaGeometries', serviceAreaGeometries);
      if (Object.keys(serviceAreaGeometries).length === 3) {
        intersect = geometryEngine.intersect(geometryEngine.intersect(serviceAreaGeometries.homeGeometry, serviceAreaGeometries.customGeometry), serviceAreaGeometries.workGeometry);
      } else if (serviceAreaGeometries.homeGeometry && serviceAreaGeometries.workGeometry) {
        intersect = geometryEngine.intersect(serviceAreaGeometries.homeGeometry, serviceAreaGeometries.workGeometry);
      } else if (serviceAreaGeometries.homeGeometry && serviceAreaGeometries.customGeometry) {
        intersect = geometryEngine.intersect(serviceAreaGeometries.homeGeometry, serviceAreaGeometries.customGeometry);
      } else if (serviceAreaGeometries.workGeometry && serviceAreaGeometries.customGeometry) {
        intersect = geometryEngine.intersect(serviceAreaGeometries.workGeometry, serviceAreaGeometries.customGeometry);
      }

      intersectLat = intersect.centroid.latitude;
      intersectLong = intersect.centroid.longitude;
      console.log("Lat", intersectLat)
      console.log("Long", intersectLong)
      console.log("home coordinates", homeX. homeY);
      console.log("work coordinates", workX, workY);

      view.goTo({
        center: [intersectLong, intersectLat],
        zoom: 10,
      });

      // sends each ring of intersection geometry to funciton to draw polygons
      for (let index = 0; index < intersect?.rings?.length; index++) {
        createIntersectPolygon(intersect, index)
      }
    }
    
    // creating filled polygon for each feature of service area, home or work
    result.serviceAreaPolygons.features.forEach(function(graphic){
      graphic.symbol = {
        type: "simple-fill",
        color: color
      }
      currentGraphicsLayer.add(graphic,0);
    });
  }

    // function to draw polygon for each ring in intersection geometry
    function createIntersectPolygon(intersection, index) {

      const intersectionPolygon = {
        type: "polygon",
        rings: [intersection.rings[index]]
      }

      const simpleFillSymbol = {
        type: "simple-fill",
        color: [227, 139, 79, 0.2],  // Orange, opacity 80%
        outline: {
          color: [255, 255, 255],
          width: 1
      }
    };
    
    const polygonGraphic = new Graphic({
      geometry: intersectionPolygon,
      symbol: simpleFillSymbol
    })
    
    // adds current ring polygon to a graphic layer and adds layer to map
    intersectGraphicsLayer.add(polygonGraphic)
    map.add(intersectGraphicsLayer);
  }  
  
  function buildRequestURL(token, studyAreas, report, format, reportFields = "{}", studyAreasOptions = "{}", returnType = "{}", useData = '{"sourceCountry":"US","hierarchy":"esri2024"}', f = "bin") {

      console.log('study: ' + studyAreas );

      let itemid = "8c4eeb44679c422a86fdbb392d81adeb"; // State of the Community custom

      report = '{"name": "SettleSmart Mapping", "token":"' + token + '","url":"https://intern-hackathon.maps.arcgis.com","itemid":"' + itemid + '"}'

      // studyAreas = "[{geometry:{x:-122.3328,y:47.6061}}]";
      format = "html";
      returnType = '{"title" : "SettleSmart Mapping", "item_properties" : ""}'

      let url = "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/GeoEnrichment/createReport?";
      url += "report=" + report;
      url += "&format=" + format;
      url += "&f=" + f;
      url += "&studyAreas=" + studyAreas;
      url += "&token=" + token;

      return url;

    }

    function loadInfoGraphic() {
      if (!intersectLat || !intersectLong ) {
        alert('You must have a target area created');
        return;
      }
      

      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };

      const token = "AAPTxy8BH1VEsoebNVZXo8HurIdz3p260SczOzIA26HzLpx1DvmZTCB6gARrkkrsnzwq10KRe_AC_3HGoPrysBwmHkl50BBQrZClTvypptAz3IDaPwqtQxekFnffLCo3JCsRs5bCNMUiFuqSAfPTqv0fpRJF1ZR_gulfqMSTAdSS-tRU2J3VWybItUcpQUD2hk_fCFIO0UPFhHGSpM_krsAy_7dD9NWoliM-x50Z8qOMrMY7xpHt4Y3Wf1RUBOPwEW7dAT1_Tb3ffdWB";


      studyAreas = "[{geometry:{x:" + intersectLong + ", y:" + intersectLat + "}"
        + ", areaType: NetworkServiceArea"
        + ", bufferUnits: Minutes"
        + ", bufferRadii: [5,10,20]"
        + ", travel_mode: Trucking"
        + ", attributes:{id:'the id',name:'Optional Name 1'}}]";

      // studyAreas='[{"geometry":{"x": -122.435, "y": 37.785},"areaType": "NetworkServiceArea","bufferUnits": "Kilometers","bufferRadii": [5,10,15],"travel_mode":"Trucking"}]';


      let url = buildRequestURL(token, studyAreas, "", "html")
      console.log("URL: " + url);

      fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log("RESULT: " + result);

          random = "<html><body>hello</body></html>";
          var doc = document.getElementById('infoFrame').contentWindow.document;
          doc.open();
          doc.write(result);
          doc.close();      
          
          modal.open = true;

        })
        .catch((error) => console.error(error));
    }
  })  
