var heatMapData = [];
//global array to store coordinates of researched routes for heatmap construction
var heatmap;
//global heatmap object
var render;
// TBD
var routeChoice;
//global Stirng to store the name of a route for indentifying user's hightlighted route

//Google initMap() default function
function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    //locating where to initialized map in HTML page
    mapTypeControl: false,
    //if allow user to change the type of map like:SATELLITE, ROADMAP,HYBRID,TERRAIN.
    center: { lat: 49.2488, lng: -122.9805 },
    //initial center when the map is loaded
    zoom: 17,
    //the degree of zoom. the bigger the number is more detailed the map will be
  });

  heatMapData = new google.maps.MVCArray();
  //TBD

  //Declare heatmap layer of google.map
  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoint(),
    //the coordinates
    map: map,
    //TBD
  });

  heatmap.setMap(map);
  //attach to google map

  new AutocompleteDirectionsHandler(map);
  //add AutocompleteDirectionHandler to map

  //********** getting current location code starts here************
  infoWindow = new google.maps.InfoWindow();
  //popup window/textbox at a given coordinates

  //HTML5 navigator function accessing user's coordinate after user's permission
  if (navigator.geolocation) {
    //if user allow to access their coordinate/location

    //function that gets user's coordinate/location
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // console.log(`${pos.lat}and ${pos.lng}`);

        var geocoder = new google.maps.Geocoder();
        //google geocoder api for converting coordinate into String of location.

        var latLng = { lat: parseFloat(pos.lat), lng: parseFloat(pos.lng) };
        //convert String of latitude and longtitude into floating number and make them a JSON.

        //request to Google geocoder API with latLng Json for String of location.
        geocoder.geocode({ location: latLng }, function (results, status) {
          if (status === `OK`) {
            //if the return status is valid.
            //results here has place_id that might be useful to auto add it as origin
            if (results[0]) {
              //if there is results from the API

              //add a Google marker on the map that visually indicates user's current location.
              var marker = new google.maps.Marker({
                position: latLng,
                map: map,
              });
              infoWindow.setPosition(pos);
              //set the popup window/textbox to user's location

              infoWindow.setContent(
                `Your current location is ${results[0].formatted_address}`
              );
              //set contenct of the popup window/textbox with the String of location provided by Google.

              infoWindow.open(map, marker);
              //TBD
            }
          }
        });
        map.setCenter(pos);
        //ReSet the center of map to user's location
      },
      //TBD
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }
}
//********** getting current location code ends here************

//initMap() function ends here

//TBD
// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(
//     browserHasGeolocation
//       ? "Error: The Geolocation service failed."
//       : "Error: Your browser doesn't support geolocation."
//   );
//   infoWindow.open(map);
// }

//global function returns coordinates array for heatmap display
function getPoint() {
  return heatMapData;
}

/**
 * @constructor
 */
//TBD
function AutocompleteDirectionsHandler(map) {
  this.map = map;
  this.originPlaceId = null;
  this.destinationPlaceId = null;
  this.travelMode = "WALKING";
  this.directionsService = new google.maps.DirectionsService();
  this.directionsRenderer = new google.maps.DirectionsRenderer(
    google.maps.DirectionsRendererOptions
  );

  // this.directionsRendereOptions = new Interface(google.maps.DirectionsRendererOptions);
  this.directionsRenderer.setMap(map);
  this.directionsRenderer.setPanel(document.getElementById("bottom-panel"));
  render = this.directionsRenderer;

  let originInput = document.getElementById("origin-input");
  let destinationInput = document.getElementById("destination-input");

  let originAutocomplete = new google.maps.places.Autocomplete(originInput);
  // Specify just the place data fields that you need.
  originAutocomplete.setFields(["place_id"]);

  let destinationAutocomplete = new google.maps.places.Autocomplete(
    destinationInput
  );
  // Specify just the place data fields that you need.
  destinationAutocomplete.setFields(["place_id"]);

  this.setupPlaceChangedListener(originAutocomplete, "ORIG");
  this.setupPlaceChangedListener(destinationAutocomplete, "DEST");

  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
  this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
    destinationInput
  );
}

// Sets the autocomplete function when a user starts to type in the input box.
AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function (
  autocomplete,
  mode
) {
  var me = this;

  autocomplete.bindTo("bounds", this.map);

  autocomplete.addListener("place_changed", function () {
    var place = autocomplete.getPlace();

    if (!place.place_id) {
      window.alert("Please select an option from the dropdown list.");
      return;
    }
    if (mode === "ORIG") {
      //asisgn the returned placeID to local placeID for origin
      me.originPlaceId = place.place_id;
    } else {
      //assign the returned placeID to local placeID for destination
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });
};

// Get routes from user input and display it
AutocompleteDirectionsHandler.prototype.route = function () {
  // if origin point or destination point is not set, return this function
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;

  this.directionsService.route(
    {
      origin: { placeId: this.originPlaceId },
      destination: { placeId: this.destinationPlaceId },
      travelMode: this.travelMode,
      provideRouteAlternatives: true,
    },
    /**
     * 
     * @param {JSON} result information about the direction, such as duration time, start point, end point...
     * @param {*} status status of data communication
     */
    function (result, status) {
      //*****************************HeatMap and Directions initializing starts *************************** */
      //check the returned status from Google.
      if (status === "OK") {
        
        let data = [];
        //array to store the encoded polyline containing coordinates for entire direction

        let routes = [];
        //array to store the summary for each route for identifying which route that is currently chosen by users.

        //Traverse the result from Google and push the data we need into related array.
        result.routes.forEach((e) => {
          data.push(e.overview_polyline);
          routes.push(e.summary);
        });

        //Post two arrays that declared above to back-end index.js for further process
        fetch("/mapmap", {
          method: "POST",
          mode: "cors",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
          //make sure to serialize your JSON body
          body: JSON.stringify({
            data,
            routes,
          }),
        })
          // .then() gets the data that passed back by res.send(decodedCoors) from index.js
          //res is a array with decoded coordinates
          .then((res) => res.json())
          .then((res) => {
            //a nested loop to push all coordinates into headmap data array
            console.log(`inmapmap`);
            
            console.log(res);
            
            for (let k = 0; k < res.length; k++) {
              for (let i = 0; i < res[k].length; i++) {
                heatMapData.push(
                  new google.maps.LatLng(res[k][i][0], res[k][i][1])
                );
              }
            }
            heatmap.setMap(heatmap.getMap());
            // update heatmap layer
          });        
        me.directionsRenderer.setDirections(result);
        // render direction on map
        
        // options for rendering direction
        me.directionsRenderer.setOptions({
          routeIndex: 1,
          suppressPolylines: true,
        });

        //***********storing the chosen route********************
        //fetch the select
        //TBD
        setTimeout(() => {
          (function () {
            const arr = result.routes;
            const arrSize = arr.length;
            console.log(`arrSize here`);
            console.log(arrSize);

            if (arrSize > 1) {
              const totalList = document
                .querySelector(".adp-list")
                .getElementsByTagName("b");
              console.log(`totalList of route here`);

              console.log(totalList);
              //turn a collection into array
              const listArr = Array.from(totalList);
              console.log(`ListArr here`);
              console.log(listArr);

              if (totalList !== null) {
                for (let i = 0; i < arrSize; i++) {
                  totalList[
                    i
                  ].parentElement.parentElement.parentElement.addEventListener(
                    "click",
                    (e) => {
                      console.log(result.routes[i].legs[0].duration.text);
                      routeTime =result.routes[i].legs[0].duration.text
                      // This will get the data
                      routeChoice = result.routes[i].summary;
                      fetch("/mapmapRoute", {
                        method: "POST",
                        mode: "cors",
                        headers: {
                          Accept: "application/json",
                          "Content-Type": "application/json",
                        },
                        //make sure to serialize your JSON body
                        body: JSON.stringify({
                          routeChoice,
                          routeTime
                        }),
                      }).then((res) => {
                        // console.log(res);
                      });

                      console.log(`current choice here ${routeChoice}`);
                    }
                  );
                }
              }
            }
          })();
        }, 500);

        //***********storing the chosen route********************
      } else {
        window.alert("Directions request failed due to " + status);
      }
    }
  );
};

//TBD
$(document).ready(function () {
  $("#myModal").modal("hide");
});

document.getElementById("input-time").addEventListener("click", (e) => {
  const timeData = document.getElementById("appt").value;

  if (timeData === "") {
    $("#myModal").modal("show");
  } else {
    console.log(timeData);
    fetch("/maptime", {
      method: "POST",
      mode: "cors",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        timeData,
      }),
    });
  }
});

