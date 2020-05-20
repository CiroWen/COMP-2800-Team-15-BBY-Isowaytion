var heatMapData = [];
var heatmap;
var render;
var routeChoice;

function initMap() {
  var map = new google.maps.Map(document.getElementById("map"), {
    mapTypeControl: false,
    center: {
      lat: 49.2488,
      lng: -122.9805
    },
    zoom: 17,
  });

  heatMapData = new google.maps.MVCArray();

  heatmap = new google.maps.visualization.HeatmapLayer({
    data: getPoint(),
    map: map,
  });

  heatmap.setMap(map);

  new AutocompleteDirectionsHandler(map);
  // getting current location
  infoWindow = new google.maps.InfoWindow();

  if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      function (position) {
        var pos = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        // console.log(`${pos.lat}and ${pos.lng}`);
        //current location for
        var geocoder = new google.maps.Geocoder();
        var latLng = {
          lat: parseFloat(pos.lat),
          lng: parseFloat(pos.lng)
        };

        geocoder.geocode({
          location: latLng
        }, function (results, status) {
          if (status === `OK`) {
            // console.log(results);
            //results here has place_id that might be useful to auto add it as origin
            if (results[0]) {
              var marker = new google.maps.Marker({
                position: latLng,
                map: map,
              });
              infoWindow.setPosition(pos);
              infoWindow.setContent(
                `Your current location is ${results[0].formatted_address}`
              );
              infoWindow.open(map, marker);
            }
          }
        });
        //       // getting current location

        map.setCenter(pos);
      },
      function () {
        handleLocationError(true, infoWindow, map.getCenter());
      }
    );
  } else {
    // Browser doesn't support Geolocation
    handleLocationError(false, infoWindow, map.getCenter());
  }

  // getting current location
}
//initMap() ends here

// function handleLocationError(browserHasGeolocation, infoWindow, pos) {
//   infoWindow.setPosition(pos);
//   infoWindow.setContent(
//     browserHasGeolocation
//       ? "Error: The Geolocation service failed."
//       : "Error: Your browser doesn't support geolocation."
//   );
//   infoWindow.open(map);
// }

function getPoint() {
  return heatMapData;
}

function changeMap() {}

/**
 * @constructor
 */
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
      me.originPlaceId = place.place_id;
    } else {
      me.destinationPlaceId = place.place_id;
    }
    me.route();
  });
};

AutocompleteDirectionsHandler.prototype.route = function () {
  if (!this.originPlaceId || !this.destinationPlaceId) {
    return;
  }
  var me = this;

  this.directionsService.route({
      // origin: {'placeId': this.originPlaceId},
      // destination: {'placeId': this.destinationPlaceId},
      origin: {
        placeId: this.originPlaceId
      },
      destination: {
        placeId: this.destinationPlaceId
      },
      travelMode: this.travelMode,
      provideRouteAlternatives: true,
    },
    function (result, status) {
      //the codes start from here to SetDirection(result) is where we process our heatmap
      //or any costomized function
      if (status === "OK") {
        console.log(result);

        //result has all the data for google map, example below accesses the test filed
        //of a route that google responses

        // result.routes.forEach((e)=>{
        //   console.log(e.legs[0].distance.text);
        //   //texts of distance of each direction
        //   console.log(e.legs[0].duration.text)
        //   //texts of time duration of each direciton
        //   //processing code here.
        // })

        //array to store the encoded coordinates
        let data = [];
        let routes = []
        result.routes.forEach((e) => {
          data.push(e.overview_polyline);
          routes.push(e.summary)
        });

        // console.log(data);

        //***********Testing purpose************ */
        // console.log(result.routes[0].legs[0].distance.text);
        //distance content of first direction

        // console.log(result.routes[0].legs[0])
        // console.log(result.routes[0].legs[0].steps[0].distance.text)
        //text of first steps of first route

        // console.log(result.routes[0].overview_path[0]);
        // var test = result.routes[0].overview_polyline;
        // console.log(test);

        // Object.entries(test).forEach(([key,value])=>{
        //   console.log(key);
        //   console.log(value);
        // })
        // console.log(result);
        // console.log(result.geocoded_waypoints[0].place_id);
        // // place id
        // console.log(test);

        // let data = [];
        //previous version using legs
        // for (let i = 0; i < result["routes"].length; i++) {
        //   data.push(result["routes"][i]["legs"][0]["steps"]);
        // }

        // currently this is just one of routes
        // let data = result["routes"][0]["legs"][0]["steps"];
        //***********Testing purpose************ */

        //fecth.post function passing the data array to back-end index.js
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
              routes
            }),
          })
          // .then() gets the data that passed back by res.send(decodedCoors)
          .then((res) => res.json())
          .then((res) => {
            //*******Testing purpose********* */
            // console.log(`reshere`);
            // console.log(res);
            // console.log(res.length);
            // console.log(res[0].length);
            // console.log(res[0][0].length);

            // console.log(JSON.stringify(res));
            // console.log(res[0][0]);
            // console.log(res[0][1]);
            //*******Testing purpose********* */

            //a nested loop to push all coordinates into headmap data array
            for (let k = 0; k < res.length; k++) {
              for (let i = 0; i < res[k].length; i++) {
                //testing
                // console.log(`testing${i}[0]`);
                // console.log(res[i][0]);
                // console.log(`testing${i}[1]`);
                // console.log(res[i][1]);
                heatMapData.push(
                  new google.maps.LatLng(res[k][i][0], res[k][i][1])
                );
              }
            }
            //*******Testing purpose********* */
            // let data = JSON.stringify(res);
            // console.log(data);
            // data = JSON.parse(data);
            // for (let i = 0; i < arrLength; i++) {
            //   let subLength = res[i].length
            //   let subLength = data[i].length;

            //   for (let j = 0; j < subLength; j++) {
            //     heatMapData.push(
            //       new google.maps.LatLng(data[i][j][0], data[i][j][1])
            //     );
            //   }
            // }
            //*******Testing purpose********* */

            // update heatmap layer
            heatmap.setMap(heatmap.getMap());
          });

        me.directionsRenderer.setDirections(result);

        me.directionsRenderer.setOptions({
          routeIndex: 1,
          suppressPolylines: true,
          //true to unable the
          // draggable:true,
          //allows user to drag the direction
        });

        var time = document.getElementById('appt').value;
        
        //***********storing the chosen route********************
        //fetch the select
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
                      // This will get the data
                      routeChoice = result.routes[i].summary

                      console.log(`current choice here ${routeChoice}`);
                      console.log(time);

                      // console.log(totalList[i]);
                      // console.log(
                      // `Summary in result: ${result.routes[i].summary}`
                      // );
                    }
                  );
                }

                // Add event listener to post the time and route choice.
                let data = document.getElementById('input-time');

                console.log(time);
                data.addEventListener("click", (e) => {

                  if (routeChoice == undefined) {
                    window.alert("Please select a route from the directions panel.");
                  } else if (time === "") {
                    window.alert("Please submit a time you will travel.")
                  } else {
                    fetch("/upload", {
                      method: "POST",
                      mode: "cors",
                      headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                      },
                      //make sure to serialize your JSON body
                      body: JSON.stringify({
                        routeChoice,
                        time,
                      }),
                    }).then((res) => {
                      // console.log(res);
  
                    })
                  }
                })
              }
            }
          })();
        }, 500);
        //***********storing the chosen route********************
      } else {
        window.alert("Directions request failed due to " + status);
      }
    });
};


// // Lets the backend know what time the user plans to use this route
// let time = document.getElementById("input-time");

// time.addEventListener("click", sendTime);

// function sendTime() {
//     let departure = document.getElementById("appt");
// }