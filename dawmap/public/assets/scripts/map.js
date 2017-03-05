var map;
var markers = [];

var Map = function () {
	var handlePublicMap = function() {
		var args = {
			zoom		: 16,
			center		: new google.maps.LatLng(1.3520865, 103.8599104),
			mapTypeId	: google.maps.MapTypeId.ROADMAP
		};
    	
    	var map = new google.maps.Map( document.getElementById('map'), args);
	};
	
    var handleIndividualMap = function() {
    	var latitude = $('#latitude').val();
    	var longitude = $('#longitude').val();
    	var latlng = new google.maps.LatLng(latitude, longitude);
    	
    	var args = {
			zoom		: 16,
			center		: latlng,
			mapTypeId	: google.maps.MapTypeId.ROADMAP
		};
    	
    	var map = new google.maps.Map( document.getElementById('map'), args);
    	
    	var marker = new MarkerWithLabel({
    		map: map,
            draggable:true,
            position: latlng,
            labelClass: 'dm-marker-label',
            labelContent: 'Move to where <br />you want your text to be',
            labelAnchor: new google.maps.Point(0, 0),
            labelInBackground: true,
            raiseOnDrag: false,
        });
    	
        markers.push(marker);
        
        google.maps.event.addListener(marker, 'dragstart', function() {
            
        });

        google.maps.event.addListener(marker, 'drag', function() {
            
        });

        google.maps.event.addListener(marker, 'dragend', function() {
        	var lat = marker.getPosition().lat();
        	var lng = marker.getPosition().lng();
        	
        	var url = '/user/update-position'
        	$.ajax({
                type: "POST",
                url: url,
                data: {lat: lat, lng: lng},
                success: function(response, status, xhr) {
                	console.log(response);
                }
            });
        });
    };
    
    return {
        init: function () {
        	if($('body').hasClass('logged-in')) {
        		handleIndividualMap();
        	} else {
        		handlePublicMap();
        	}
        },
    };

}();

jQuery(document).ready(function() {    
	Map.init();
});