function initMap() {
    var map = new google.maps.Map(document.getElementById('map'), {
      mapTypeControl: false,
      center: {lat: 49.2488, lng: -122.9805},
      zoom: 13,
      styles: [
        {elementType: 'geometry', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.stroke', stylers: [{color: '#242f3e'}]},
        {elementType: 'labels.text.fill', stylers: [{color: '#746855'}]},
        {
          featureType: 'administrative.locality',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'geometry',
          stylers: [{color: '#263c3f'}]
        },
        {
          featureType: 'poi.park',
          elementType: 'labels.text.fill',
          stylers: [{color: '#6b9a76'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry',
          stylers: [{color: '#38414e'}]
        },
        {
          featureType: 'road',
          elementType: 'geometry.stroke',
          stylers: [{color: '#212a37'}]
        },
        {
          featureType: 'road',
          elementType: 'labels.text.fill',
          stylers: [{color: '#9ca5b3'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry',
          stylers: [{color: '#746855'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'geometry.stroke',
          stylers: [{color: '#1f2835'}]
        },
        {
          featureType: 'road.highway',
          elementType: 'labels.text.fill',
          stylers: [{color: '#f3d19c'}]
        },
        {
          featureType: 'transit',
          elementType: 'geometry',
          stylers: [{color: '#2f3948'}]
        },
        {
          featureType: 'transit.station',
          elementType: 'labels.text.fill',
          stylers: [{color: '#d59563'}]
        },
        {
          featureType: 'water',
          elementType: 'geometry',
          stylers: [{color: '#17263c'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.fill',
          stylers: [{color: '#515c6d'}]
        },
        {
          featureType: 'water',
          elementType: 'labels.text.stroke',
          stylers: [{color: '#17263c'}]
        }
      ]
    });
  
    new AutocompleteDirectionsHandler(map);
  }
  
  /**
   * @constructor
   */
  function AutocompleteDirectionsHandler(map) {
    this.map = map;
    this.originPlaceId = null;
    this.destinationPlaceId = null;
    this.travelMode = 'WALKING';
    this.directionsService = new google.maps.DirectionsService;
    this.directionsRenderer = new google.maps.DirectionsRenderer;
    this.directionsRenderer.setMap(map);
    this.directionsRenderer.setPanel(document.getElementById('bottom-panel'));
  
    let originInput = document.getElementById('origin-input');
    let destinationInput = document.getElementById('destination-input');
  
    let originAutocomplete = new google.maps.places.Autocomplete(originInput);
    // Specify just the place data fields that you need.
    originAutocomplete.setFields(['place_id']);
  
    let destinationAutocomplete =
        new google.maps.places.Autocomplete(destinationInput);
    // Specify just the place data fields that you need.
    destinationAutocomplete.setFields(['place_id']);
  
    this.setupPlaceChangedListener(originAutocomplete, 'ORIG');
    this.setupPlaceChangedListener(destinationAutocomplete, 'DEST');
  
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(originInput);
    this.map.controls[google.maps.ControlPosition.TOP_LEFT].push(
        destinationInput);
  }
  
  // Sets the autocomplete function when a user starts to type in the input box.
  AutocompleteDirectionsHandler.prototype.setupPlaceChangedListener = function(
      autocomplete, mode) {
    var me = this;
    autocomplete.bindTo('bounds', this.map);
  
    autocomplete.addListener('place_changed', function() {
      var place = autocomplete.getPlace();
  
      if (!place.place_id) {
        window.alert('Please select an option from the dropdown list.');
        return;
      }
      if (mode === 'ORIG') {
        me.originPlaceId = place.place_id;
      } else {
        me.destinationPlaceId = place.place_id;
      }
      me.route();
    });
  };
  
  AutocompleteDirectionsHandler.prototype.route = function() {
    if (!this.originPlaceId || !this.destinationPlaceId) {
      return;
    }
    var me = this;
  
    this.directionsService.route(
        {
          origin: {'placeId': this.originPlaceId},
          destination: {'placeId': this.destinationPlaceId},
          travelMode: this.travelMode,
          provideRouteAlternatives: true,
        },
        function(result, status) {
          if (status === 'OK') {
              
            me.directionsRenderer.setDirections(result);
          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
  };