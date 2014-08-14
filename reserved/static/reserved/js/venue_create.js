// Note: This example requires that you consent to location sharing when
// prompted by your browser. If you see a blank space instead of the map, this
// is probably because you have denied permission for location sharing.

var map;
var currentPopup;
var circle;
var dropMarker;
var searchBox;
var markers = [];
var service;
var input;
// Value of the geo location if performed.
var geoPosition;

var mapOptions = {
    zoom: 9
    , mapTypeId: google.maps.MapTypeId.ROADMAP
};


var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-33.8902, 151.1759)
    , new google.maps.LatLng(-33.8474, 151.2631)
    );


var geoLocation = function(){
    if(navigator.geolocation) {

        navigator.geolocation.getCurrentPosition(function(position) {
          var pos = new google.maps.LatLng(position.coords.latitude,
                                           position.coords.longitude);

          geoPosition = pos;
          currentPopup = new google.maps.InfoWindow({
            map: map
            , position: pos
            , content: 'Location found using HTML5.'
          });

          map.setCenter(pos);

      }, function() {
          handleNoGeolocation(true);
      });

    } else {
        // Browser doesn't support Geolocation
        handleNoGeolocation(false);
    }
}


var placeChangedEventHandler = function() {
    var places = searchBox.getPlaces();

    if (places.length == 0) {
        return;
    }

    for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();
    for (var i = 0, place; place = places[i]; i++) {
        var image = {
            url: place.icon,
            size: new google.maps.Size(71, 71),
            origin: new google.maps.Point(0, 0),
            anchor: new google.maps.Point(17, 34),
            scaledSize: new google.maps.Size(25, 25)
        };

        // Create a marker for each place.
        var marker = new google.maps.Marker({
            map: map,
            icon: image,
            title: place.name,
            position: place.geometry.location
        });

        markers.push(marker);

        bounds.extend(place.geometry.location);
    }

    map.fitBounds(bounds);
}


var mapBoundsChangedEventHandler = function() {
    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
}


var mapClickEventHandler = function(event) {
     placeMarker(event.latLng);
}

// This example adds a search box to a map, using the Google Place Autocomplete
// feature. People can enter geographical searches. The search box will return a
// pick list containing a mix of places and predicted search terms.

var handleNoGeolocation = function handleNoGeolocation(errorFlag) {
    if (errorFlag) {
        var content = 'Error: The Geolocation service failed.';
    } else {
        var content = 'Error: Your browser doesn\'t support geolocation.';
    }

    var options = {
        map: map,
        position: new google.maps.LatLng(60, 105),
        content: content
    };

    currentPopup = new google.maps.InfoWindow(options);
    map.setCenter(options.position);
}


var placeMarker = function placeMarker(location) {

    if(circle) {
      // remove it
      circle.setMap(null);
    }

    if(currentPopup) currentPopup.close();

    var dropOptions = {
        position: location,
        animation: google.maps.Animation.DROP,
        draggable:true,
        map: map
    };

    if(dropMarker) {
        dropMarker.setOptions(dropOptions);
    } else {
        dropMarker = new google.maps.Marker(dropOptions);
    }
}

var addressChangeJsonHandler = function(data){
    var location;
    if( data.length == 1 ) {
        location = data[0];
    }

    if( location ){

        var pos = new google.maps.LatLng(location.latitude,
                               location.longitude);

        if(currentPopup) currentPopup.close();

        currentPopup = new google.maps.InfoWindow({
          map: map
          , position: pos
          , content: '<strong>Selected Address:</strong> ' + location.name
        });

        // Push the selected address to the input field.
        $('#pac-input').val(location.address);

        map.panTo(pos);

               // Create a marker for each place.
        /*
        marker = new google.maps.Marker({
            map: map,
            // icon: image,
            title: location.name,
            position: pos
        });
        */
       var circleOptions = {
          strokeColor: '#000',
          strokeOpacity: 0.8,
          strokeWeight: 2,
          fillColor: '#000',
          fillOpacity: 0.6,
          map: map,
          center: pos,
          radius: 50 // Math.sqrt(citymap[city].population) * 100
      };

      // Add the circle for this city to the map.
      if(circle) {
          circle.setOptions(circleOptions)
      } else {
          circle = new google.maps.Circle(circleOptions);
      }
    }
}

var servicePredictionHandler = function(value, data, status) {
  console.log(status, value)

  if (status != google.maps.places.PlacesServiceStatus.OK) {
      console.log(status);
      return;
  }

  for (var i = data.length - 1; i >= 0; i--) {
    console.log(data[i].description);
  };

}

var addressNoMatch = function(value){
    console.log('Tell google maps');
    $('#pac-input').val(value);

    service.getPlacePredictions({
      input: value
      // 100~ miles.
      , radius: 160934
      , location: geoPosition
    }, function(data, status){
      servicePredictionHandler(value, data, status)
    });

    return 'Searching for "' + value + '" on Google Maps...'
    // if good result from map, map it and show create new
    // address button.
}


function initialize() {

    service = new google.maps.places.AutocompleteService();
    map = new google.maps.Map($('#map-canvas')[0], mapOptions);
    // Create the search box and link it to the UI element.
    input = $('#pac-input')[0];

    map.fitBounds(defaultBounds);
    map.controls[google.maps.ControlPosition.TOP_LEFT].push(input);

    searchBox = new google.maps.places.SearchBox( (input) );

    // Listen for the event fired when the user selects an item from the
    // pick list. Retrieve the matching places for that item.
    google.maps.event.addListener(searchBox, 'places_changed', placeChangedEventHandler);
    google.maps.event.addListener(map, 'click', mapClickEventHandler);
    google.maps.event.addListener(map, 'bounds_changed', mapBoundsChangedEventHandler);

    geoLocation();
}

;$(function(){

    $('#id_address').select2({
        placeholder: 'Select an address'
        , allowClear: true
        , width: 'resolve'
        , formatNoMatches: addressNoMatch
    })

    $('#id_address').change(function(e){
        var id = $(this).val();
        var marker;
        $.getJSON('/api/locations/' + id, addressChangeJsonHandler)
    });
});

google.maps.event.addDomListener(window, 'load', initialize);

