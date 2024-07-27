

require(["esri/config", "esri/Map", "esri/views/MapView", "esri/Graphic", "esri/layers/GraphicsLayer", "esri/rest/serviceArea",
  "esri/rest/support/ServiceAreaParameters",
  "esri/rest/support/FeatureSet",], function (esriConfig, Map, MapView, Graphic, GraphicsLayer, serviceArea, ServiceAreaParams, FeatureSet) {


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
    let customTime  = customTimeEl.value;
    // grabs combobox inputs --> defaults to Car
    let homeTravelType = homeTravelTypeEl.value;
    let workTravelType = workTravelTypeEl.value;
    let customTravelType = customTravelTypeEl.value;


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

    placeElement.addEventListener('click', () => {
      hideAllContainers();
      placesContainer.classList.remove('hidden');
    });

    customElement.addEventListener('click', () => {
      hideAllContainers();
      customContainer.classList.remove('hidden');
    });

    infoElement.addEventListener('click', () => {
      // alert('info');

      loadInfoGraphic();
      // sheet.open = true;
      modal.open = true;
    });

    /**
     * Grabs text inputs from user
     */

  // Gets Home Address
  homeAddressElement.addEventListener('calciteInputTextChange', function(event) {
    homeAddress = event.target.value;
    // adds message
    if (homeAddress) {
      valHomeAddressEl.icon="check";
      valHomeAddressEl.status="valid";
      valHomeAddressEl.innerText="Place added on map!";
    } else {
      valHomeAddressEl.icon="x";
      valHomeAddressEl.status="invalid"
      valHomeAddressEl.innerText="Invalid address!";
    }
    console.log("place, work, home, custom", placeInput, workAddress, homeAddress, customAddress);
  });
  // Gets Work Address
  workAddressElement.addEventListener('calciteInputTextChange', function(event) {
    workAddress = event.target.value;
    if (workAddress) {
      valWorkAddressEl.icon="check";
      valWorkAddressEl.status="valid";
      valWorkAddressEl.innerText="Place added on map!";
    } else {
      valWorkAddressEl.icon="x";
      valWorkAddressEl.status="invalid"
      valWorkAddressEl.innerText="Invalid address";
    }
    console.log("place, work, home, custom", placeInput, workAddress, homeAddress, customAddress);
  });
  // Get Custom Address
  customAddressElement.addEventListener('calciteInputTextChange', function(event) {
    customAddress = event.target.value;
    if (customAddress) {
      valCustomAddressEl.icon="check";
      valCustomAddressEl.status="valid";
      valCustomAddressEl.innerText="Place added on map!";
    } else {
      valCustomAddressEl.icon="x";
      valCustomAddressEl.status="invalid"
      valCustomAddressEl.innerText="Invalid address";
    }
    console.log("place, work, home, custom", placeInput, workAddress, homeAddress, customAddress);
  });
  // Gets place input
  placeInputElement.addEventListener('calciteInputTextChange', function(event) {
    placeInput = event.target.value;
    console.log("place, work, home, custom", placeInput, workAddress, homeAddress, customAddress);
  });
  
  /**
   * Grabs slider inputs from user
   */

  // grabs home slider
  travelTimeEl.addEventListener('calciteSliderChange', function(event) {
    travelTime = event.target.value;
    console.log("travelTime, workCommuteTime, customTime", travelTime, workCommuteTime, customTime);
  });
  // grabs work slider
  workCommuteTimeEl.addEventListener('calciteSliderChange', function(event) {
    workCommuteTime = event.target.value;
    console.log("travelTime, workCommuteTime, customTime", travelTime, workCommuteTime, customTime);
  });
  // grabs custom slider
  customTimeEl.addEventListener('calciteSliderChange', function(event) {
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
    console.log("home and work travel and custom type", homeTravelType, workTravelType, customTravelType);
  });

  // grabs work travel type
  workTravelTypeEl.addEventListener('calciteComboboxChange', function(event) {
    const val = event.target.value;
    workTravelType = val;
    console.log("home and work travel and custom type", homeTravelType, workTravelType, customTravelType);
  })

  // grabs custom travel typ
  customTravelTypeEl.addEventListener('calciteComboboxChange', function(event) {
    const val = event.target.value;
    customTravelType = val;
    console.log("home and work travel and custom type", homeTravelType, workTravelType, customTravelType);
  })

  /**
   * implements button logic
   */

  // reset home button logic
  homeResetEl.addEventListener('click', function() {
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
  // reset custom button logic
  customResetEl.addEventListener('click', function() {
    // reset to graphics layer
    customGraphicsLayer.removeAll();
    // reseting logic
    customAddressElement.value = '';
    customAddress = undefined;
    customTravelTypeEl.value = "Driving";
    customTravelType = "Driving";
    customTimeEl.value = 30;
    customTime = 30;
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
  customRunEl.addEventListener('click', function() {
    console.log("hit");
    geocodeCustomAddress();
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

  function geocodeCustomAddress(){
    console.log("Custom address API response")
    const geocodedUrlwork= `https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates?SingleLine=${customAddress}&category=&outFields=*&forStorage=false&f=pjson&token=${apiKey}`;
    fetch(geocodedUrlwork)
      .then(function(responsec) {
        if (!responsec.ok) {
          throw new Error('Network response was not ok ' + responsec.statusText);
        }
        return responsec.json();
      })
      .then(function(datac) {
        // Handle the response data
        console.log("Geocode response for work addy: ", datac);
        customX = datac.candidates[0]?.location.x;
        customY = datac.candidates[0]?.location.y;
        addCustomCoordinate()
      })
      .catch(function(error) {
        // Handle any errors
        console.error("Error occurred: ", error);
      });
  }


  const homeGraphicsLayer = new GraphicsLayer();
  const workGraphicsLayer = new GraphicsLayer();
  const customGraphicsLayer = new GraphicsLayer();
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
      // only home coordinates
      // if (!workX && !workY) {
      //   view.goTo({
      //     center: [homeX, homeY],
      //     zoom: 10,
      //   });
      //   // only work coordinates
      // } else if (!homeX && !homeY) {
      //   view.goTo({
      //     center: [workX, workY],
      //     zoom: 10,
      //   });
      //   // both work and home coordinates
      // } else {
      //   const midLatitude = (homeX + workX) / 2;
      //   const midLongitude = (homeY + workY) / 2;
      //   view.goTo({
      //     center: [midLatitude, midLongitude],
      //     zoom: 9,
      //   });
      // }
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

    // NEED TO ADD LOGIC TO DELETE A POINT
    function addCustomCoordinate() {
      if (customX && customY) {
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

      
      const customServiceAreaParams = (createServiceAreaParams(pointGraphic, customTime, view.SpatialReference))
      solveServiceArea(serviceAreaUrl, customServiceAreaParams, customGraphicsLayer, [0, 222, 166, 0.4])
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
        .then(function (result) {
          if (result.serviceAreaPolygons.features.length) {
            currentGraphicsLayer.removeAll()
            // Draw each service area polygon
            result.serviceAreaPolygons.features.forEach(function (graphic) {
              graphic.symbol = {
                type: "simple-fill",
                color: color
              }
              currentGraphicsLayer.add(graphic, 0);
            });
          }
        }, function (error) {
          console.log(error);
        });
    }



    function buildRequestURL(token, studyAreas, report, format, eportFields = "{}", studyAreasOptions = "{}", returnType = "{}", useData='{"sourceCountry":"US","hierarchy":"esri2024"}', f = "bin") {
      let itemid = "ca02fc5f2390457e8ef20029e627dc31"; // Race and Age Profile Dark Theme (Esri 2024)
      itemid = "6679ef4321494048bdb6a6d163cdecb4"; // Community Profile Hackathon
      report='{"itemid":"6679ef4321494048bdb6a6d163cdecb4","url":"intern-hackathon.maps.arcgis.com"}'


      studyAreas = '[{"geometry":{"x":-122.3328,"y":47.6061}}]';
      // report = "dandi";
      token = "AAPTxy8BH1VEsoebNVZXo8HurIdz3p260SczOzIA26HzLpx1DvmZTCB6gARrkkrsnzwq10KRe_AC_3HGoPrysBwmHkl50BBQrZClTvypptAz3IDaPwqtQxekFnffLCo3JCsRs5bCNMUiFuqSAfPTqv0fpRJF1ZR_gulfqMSTAdSS-tRU2J3VWybItUcpQUD2hk_fCFIO0UPFhHGSpM_krsAy_7dD9NWoliM-x50Z8qOMrMY7xpHt4Y3Wf1RUBOPwEW7dAT1_Tb3ffdWB";
      format = "html";


      let url = "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/GeoEnrichment/createReport?";
      url += "report=" + report;
      url += "&format=" + format;
      url += "&f=" + f;
      url += "&studyAreas=" + studyAreas;
      url += "&token=" + token;

      console.log("URL");
      console.log(url);

      return url;

    }

    function loadInfoGraphic() {

      const requestOptions = {
        method: "GET",
        redirect: "follow"
      };


      let itemid = "ca02fc5f2390457e8ef20029e627dc31"; // Race and Age Profile Dark Theme (Esri 2024)
      // itemid = "6679ef4321494048bdb6a6d163cdecb4"; // Community Profile Hackathon
      // itemid = "537230b385fb45d9a8d6e59265e36fbf"; // Transportation to Work
      const token = "AAPTxy8BH1VEsoebNVZXo8HurIdz3p260SczOzIA26HzLpx1DvmZTCB6gARrkkrsnzwq10KRe_AC_3HGoPrysBwmHkl50BBQrZClTvypptAz3IDaPwqtQxekFnffLCo3JCsRs5bCNMUiFuqSAfPTqv0fpRJF1ZR_gulfqMSTAdSS-tRU2J3VWybItUcpQUD2hk_fCFIO0UPFhHGSpM_krsAy_7dD9NWoliM-x50Z8qOMrMY7xpHt4Y3Wf1RUBOPwEW7dAT1_Tb3ffdWB";
      const format = "html";
      const studyAreas = '[{"geometry":{"x":-122.3328,"y":47.6061}}]';

      const url = "https://geoenrich.arcgis.com/arcgis/rest/services/World/geoenrichmentserver/GeoEnrichment/createReport?report={\"itemid\":\""
        + itemid + "\"}"
        + "&format=" + format
        + "&f=bin"
        + "&studyAreas=" + studyAreas
        + "&token=" + token;

      // let url = buildRequestURL(token, "","","html")
      console.log(url);

      fetch(url, requestOptions)
        .then((response) => response.text())
        .then((result) => {
          console.log("RESULT: " + result);


          random = "<html><body>hello</body></html>";
          var doc = document.getElementById('infoFrame').contentWindow.document;
          doc.open();
          doc.write(result);
          doc.close();



          var doc2 = document.getElementById('infoFrame2').contentWindow.document;
          doc2.open();
          doc2.write(random);
          doc2.close();


        })
        .catch((error) => console.error(error));
    }
  })
