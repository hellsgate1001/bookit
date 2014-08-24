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
var places;
// Value of the geo location if performed.
var geoPosition;
var mapData = [];
var googleResult;
var $addressSelect;

var mapOptions = {
    zoom: 9
    , mapTypeId: google.maps.MapTypeId.ROADMAP
};

var defaultBounds = new google.maps.LatLngBounds(
    new google.maps.LatLng(-33.8902, 151.1759)
    , new google.maps.LatLng(-33.8474, 151.2631)
    );

function initialize() {

    service = new google.maps.places.AutocompleteService();
    map = new google.maps.Map($('#map-canvas')[0], mapOptions);
    places = new google.maps.places.PlacesService(map);
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
    $('#id_company').select2({
        placeholder: 'Select a Company'
        , allowClear: true
        , width: 'resolve'
        // , formatNoMatches: addressNoMatch
        // , data:{ results: mapData, text: function(item) { return item.description ; } }
    });

    $('#id_address').select2({
        placeholder: 'Select an address'
        , allowClear: true
        , width: 'resolve'
        , formatNoMatches: addressNoMatch
        // , data:{ results: mapData, text: function(item) { return item.description ; } }
    });

    $('#id_address').change(onAddressInputChange);
    $addressSelect = $('#id_address').data('select2').container;
});

google.maps.event.addDomListener(window, 'load', initialize);


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

var placeChangedEventHandler = function() {
    setInvalid()

    var _places = searchBox.getPlaces();

    if (_places.length == 0) {
        return;
    }

    for (var i = 0, marker; marker = markers[i]; i++) {
        marker.setMap(null);
    }

    // For each place, get the icon, place name, and location.
    markers = [];
    var bounds = new google.maps.LatLngBounds();

    for (var i = 0, place; place = _places[i]; i++) {
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

    places.getDetails(_places[0], function( result, status) {
        var gr = result;
        placeMarker(gr.geometry.location, {
            // icon: gr.icon
            title: gr.formatted_address
        });
        map.setCenter(gr.geometry.location)
        // $('#pac-input').val(gr.name);
        $('#id_name').val(gr.name  + ', ' + gr.vicinity);
        setValidAddress(gr)
    });

    map.fitBounds(bounds);
}

var mapClickEventHandler = function(event) {

    placeMarker(event.latLng);
    places.search({
      location:event.latLng
      , radius: 5
    }, function(results, status, page){
        console.log(results);
        var s = '<div>Pick the closest:</div><ul>'
        for (var i = results.length - 1; i >= 0; i--) {
            clickHash[results[i].id]  = results[i];
            s += sprintf( '<li><a href="javascript: ch(\'%(id)s\');" id="%(place_id)s">%(name)s</a></li>', results[i])
        };
        s += '</ul>'

        currentPopup = new google.maps.InfoWindow({
          map: map
          , position: event.latLng
          , content: s
        });
    })
}

var mapBoundsChangedEventHandler = function() {
    // Bias the SearchBox results towards places that are within the bounds of the
    // current map's viewport.
    var bounds = map.getBounds();
    searchBox.setBounds(bounds);
}


var onAddressInputChange = function(e){

    var id = $(this).val()
        , marker
        , $option =  $(this).find('option[value="' + $(this).val() + '"]')
        , googleLocation = $option.data('location')
        ;

    setInvalid()

    if(googleLocation) {
        places.getDetails(googleLocation, function( result, status) {
            googleResult = result;
            var gr = googleResult;

            placeMarker(googleResult.geometry.location, {
                // icon: gr.icon
                title: gr.formatted_address
            });

            map.setCenter(gr.geometry.location)
            // $('#pac-input').val(gr.name);
            $('#id_name').val(gr.name  + ', ' + gr.vicinity);
            $option.val('')
            $('#id_full_address').val(gr.formatted_address)
            setValidAddress(gr)
        });
    } else {
        $.getJSON('/api/locations/' + id, addressChangeJsonHandler)
    }
}

// Disable function
jQuery.fn.extend({
    disable: function(state) {
        return this.each(function() {
            this.disabled = (state === undefined)? true: state;
        });
    }
});

var validAddress, validLatLng;
var setValidAddress = function(d) {
    // console.log('valid location', d)
    validAddress = d;
    var name = d.address || d.name;

    if( d.latitude && d.longitude ) {
        validLatLng = [d.latitude, d.longitude];
    } else if( d.geometry.location ) {
        validLatLng = [d.geometry.location.k, d.geometry.location.B];
    }

    console.log('name', name);
    console.log('lat long', validLatLng);

    $('#id_latlng').val( validLatLng.join(',') );
    $('#pac-input').val(name);
      $('#id_name').val(d.name  + ', ' + (d.vicinity || d.address));
    $('span#select2-chosen-2').text(name)

    // debugger; // correct address shoudl go here.
    $('#id_full_address').val(d.formatted_address || d.address)

    if( validLatLng[0] !== undefined
        && validLatLng[1] !== undefined ) {
        $addressSelect.addClass('valid');

        $('#id_save').disable(false)
    }
}

var setInvalid = function(){
    $addressSelect.removeClass('valid');
    $('#id_save').disable()

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
        // $('#pac-input').val(location.address);
        setValidAddress(location)
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

    setInvalid()

    if (status != google.maps.places.PlacesServiceStatus.OK) {
      console.log(status);
      return;
    }

    mapData = data;
    var d = [];

    for (var i = data.length - 1; i >= 0; i--) {
        // console.log(data[i].description);
        $('<option/>', {
            value: data[i].id
        })
        .text(data[i].description)
        .data('location', data[i])
        .appendTo( '#id_address')
    };
// $('#id_address').select2("data", d, true);
}

var clickHash = {};

var ch = function(id) {

  if( !clickHash[id] ) {
      throw new Error('Cannot find clickable: ' + id);
  }

  var location = clickHash[id];

  places.getDetails(location, function( result, status) {
      googleResult = result;
      var gr = googleResult;
      placeMarker(googleResult.geometry.location, {
          // icon: gr.icon
          title: gr.formatted_address
      });

      map.setCenter(gr.geometry.location);
      // $('#pac-input').val(gr.name);
      $('#id_name').val(gr.name  + ', ' + gr.vicinity);
      setValidAddress(gr)
  });
}


var placeMarker = function placeMarker(location, options) {

    if(circle) {
      // remove it
      circle.setMap(null);
    }

    options = options || {};

    if(currentPopup) currentPopup.close();

    var dropOptions = {
        position: location,
        animation: google.maps.Animation.DROP,
        draggable:true,
        map: map
    };

    var opts = Application.extend({}, dropOptions, options);

    if(dropMarker) {
        dropMarker.setOptions(opts);
    } else {

        dropMarker = new google.maps.Marker(opts);
    }
}

var addressNoMatch = function(value){
    console.log('Tell google maps');
    $('#pac-input').val(value);
    placesSearch(value, geoPosition);
    return 'Searching for "' + value + '" on Google Maps...'
    // if good result from map, map it and show create new
    // address button.
}

var placesSearch = function(value, position, radius){

    service.getPlacePredictions({
      input: value
      // 100~ miles.
      , radius: radius || 160934
      , location: position
    }, function(data, status){
        servicePredictionHandler(value, data, status)
    });
}
