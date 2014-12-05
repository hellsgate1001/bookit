
;(function($){
	var googleMapPath = 'http://maps.googleapis.com/maps/api/staticmap?%(query)s'
	var pathData = {
		 center: 'Glasgow'
		, size: '800x600'
		, zoom: 14
		, mapType: 'roadmap'
		, markers: "color:blue|label:point|%(markerCenter)s"
	};

	serialize = function(obj, prefix) {
	  var str = [];
	  for(var p in obj) {
	    var k = prefix ? prefix + "[" + p + "]" : p, v = obj[p];
	    str.push(typeof v == "object" ?
	      serialize(v, k) :
	      encodeURIComponent(k) + "=" + encodeURIComponent(v));
	  }
	  return str.join("&");
	}

	getMapUrl = function(data){
		data = data || {};
		var d = Application.extend({}, pathData, data);
		d.markers = sprintf(d.markers, d);
		d.query = serialize(d)
		var path = sprintf(googleMapPath, d);
		return path;
	}

	getVenueStaticMap = function(id) {
		var $venue =  $('#venue_' + id);
		var ll = $venue.data('latlng');

		var markerCenter = ll;
		var center = ll.split(',')[0] + ',' + String( parseFloat(ll.split(',')[1]) )
		var width = parseInt( $venue.outerWidth());
		var height = parseInt( $venue.outerHeight());
		return getMapUrl({
			center: center
			, size: width + 'x' + height
			, markerCenter: markerCenter
		});
	}

	applyVenueMaps = function(){
		$('.listmap img.map').each(function(){
			var url = getVenueStaticMap( $(this).data('venue') );
			$(this).attr('src', url)
		})
	}

	$(document).ready(function(){
		applyVenueMaps()
	})
})($)

// http://maps.googleapis.com/maps/api/staticmap
// ?center=55.8577498,-4.2453985
// &size=800x200
// &zoom=14
// &maptype=roadmap
// &shadow=true
// &markers=color:blue%7Clabel:Point%7C55.8577498,-4.2453985
