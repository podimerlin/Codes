// Map Configuration
var defaultAddress = "Singapore";
var defaultHTML = "<strong>Singapore</strong>";
var defaultZoomLevel = 12; //Larger Number = Higher Zoom
var mapDivID = "map-canvas";
var searchControls = true;
var infoWindowDivID = "";
var icon = "";
var infoBox;

//Database Bounds Search Extension
var extendLat = 0.05;
var extendLng = 0.005;
var dbPath = "/listing/load";
var pin_hover_storage;

/*-------------------------------*/
/*  Do Not edit below this line  */
/*-------------------------------*/
var startAddress;
var mapDiv;
var mapLoading;
var markers = [];
var classAdder;
var iCircle;
var lastInfoWindow;
var classMarker;

function setupAddress() {
    if (typeof poiAddress === 'undefined') {
        startAddress = defaultAddress;
    } else {
        startAddress = poiAddress;
    }
    if (typeof poiHTML === 'undefined') {
        markerHTML = defaultHTML;
    } else {
        markerHTML = poiHTML;
    }
    if (typeof poiZoomLevel === 'undefined') {
        zoomLevel = defaultZoomLevel;
    } else {
        zoomLevel = poiZoomLevel;
    }
}

function centerBox(child, parent) {
    var h = document.getElementById(child).offsetHeight;
    var a = Math.round(parseInt(document.getElementById(parent).offsetHeight, 10) / 2);
    var b = Math.round(h / 2);
    var c = (a - b) + "px";
    document.getElementById(child).style.top = c;
    var w = document.getElementById(child).offsetWidth;
    var x = Math.round(parseInt(document.getElementById(parent).offsetWidth, 10) / 2);
    var y = Math.round(w / 2);
    var z = x - y;
    document.getElementById(child).style.left = z + "px";
}

function html_entity_decode(str) {
	var ta=document.createElement("textarea");
	ta.innerHTML=str.replace(/</g,"&lt;").replace(/>/g,"&gt;");
	return ta.value;
}

function hasClass(ele, cls) {
    return ele.className.match(new RegExp('(\\s|^)' + cls + '(\\s|$)'));
}

function addClass(ele, cls) {
    if (!this.hasClass(ele, cls)) {
        ele.className += " " + cls;
    }
}

function removeClass(ele, cls) {
    if (hasClass(ele, cls)) {
        var reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
        ele.className = ele.className.replace(reg, ' ');
    }
}

function iwHandle(infowindow, map, marker) {
	if (infoWindowDivID !== ""){
		externalDiv = document.getElementById(infoWindowDivID);
		externalDiv.innerHTML = infowindow.content;
	} else {
		infowindow.open(map,marker);
		lastInfoWindow = infowindow;
	}
}

function addMarker(overlap, latlng, id, count, cico) {
    if(count.toString().length == 1) {
        icon = "marker_1x.png";
    } else if(count.toString().length == 2) {
        icon = "marker_2x.png";
    } else {
        icon = "marker_3x.png";
    }
     
    var marker = new MarkerWithLabel({
        position: latlng,
        map: map,
        icon: $('base').attr('href') + '/img/' + icon,
        labelContent: count.toString(),
        labelAnchor: new google.maps.Point(12, 36),
        labelClass: "icon-label", // the CSS class for the label
        labelVisible: true,
        labelZIndex: 1030,
        idul: id,
        total: parseInt(count),
        catul: icon
    });
    markers.push(marker);
    
    // Show/Hide Marker in Circle
    /*
    var rPosition = iCircle.get('position');
    var rDistance = iCircle.getRadius() / 1000;
    var mPosition = marker.getPosition();
    var mDistance = distanceBetweenPoints(rPosition, mPosition);
    if(mDistance <= rDistance) {
        marker.setVisible(true);
    } else {
        marker.setVisible(false);
    }*/
    
    // Infobox
    infoBox.open(map, marker);
    
    google.maps.event.addListener(marker, 'click', function() {
        //hover_action_pin(marker.get("idul"));
        //load_cluster(marker.get("idul"));
    	console.log(marker);
    });
    google.maps.event.addListener(marker, 'mouseover', function() {
        console.log(marker);
        
    	//hover_action_pin(marker.get("idul"));
        
        //var count = marker.get('total');
        //var data_id = marker.get('idul');
        $.ajax({
            type: "POST",
            url: $('base').attr('href') + '/listing/cluster',
            data: {
                id: cluster_id,
            },
            dataType: 'json',
            beforeSend: function() {
                openProccess();
                $('#grid').find('.grid-list').remove();
            },
            success: function(itemJson) {
                closeProccess();
                $('#grid').append(itemJson.html);
                $('#grid .list-list').addClass('hide');
            },
            error : function(xhr, status){
                console.log(status);
            },
        });
        var image_src = '';
        var title = '';
        var total = 1;
        
        $html = '<div class="info_hover">';
        $html += '	<div class="hover-thumb">';
        $html += '		<img src="'+image_src+'" />';
        $html += '	</div>';
        $html += '	<div class="hover-content">';
        $html += '		<div class="hover-title ellipsis">' + title + '</div>';
        $html += '		<p>'+total+'</p>';
        $html += '	</div>';
        $html += '</div>';
        
        infoBox.setContent($html);
        infoBox.open(map, this);
    });
    google.maps.event.addListener(marker, 'mouseout', function() {
        //return_hover_action_pin(marker.get("idul"));
        //infoBox.close();
    });
}

function showMarkers() {
    for (var i=0; i<markers.length; i++) {
        markers[i].setVisible(true);
    }
}

function hideMarkers() {
    for (var i=0; i<markers.length; i++) {
        markers[i].setVisible(false);
    }
}

function loadMap() {
    var i;
    var bounds = map.getBounds();
    var southWest = bounds.getSouthWest();
    var northEast = bounds.getNorthEast();
    var swLat = southWest.lat();
    var swLng = southWest.lng();
    var neLat = northEast.lat();
    var neLng = northEast.lng();
    var filename = dbPath + "?swLat="+ swLat + "&swLng="+ swLng + "&neLat="+ neLat + "&neLng="+ neLng + "&extendLat="+ extendLat + "&extendLng="+ extendLng;
    
    $.getJSON(filename, function(data) {
        for (i = 0; i < data.markers.length; i++) {
            var result = data.markers[i];
            var latlng = new google.maps.LatLng(parseFloat(result.center.lat), parseFloat(result.center.lng));
            addMarker(result.overlap, latlng, result.id, result.count, result.cico); 
        }
        $('#listings').html(data.html);
        $('#total').text(data.total);
    });
}

function clearMarkers() {
    for (var i=0; i<markers.length; i++) {
        markers[i].setMap(null);
    }
    markers = [];
}

function findMe(element) {
    var self = this;
    var $element = $(element);
    var $icon = $('#find-me-icon');
    var $spinner = $('#find-me-spinner');
    $element.on('click', function() {
        $icon.hide();
        $spinner.show();
        navigator.geolocation.getCurrentPosition(
        function(position) {
            self.currentUserLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            self.map.panTo(self.currentUserLocation);
            self.map.setZoom(16);
            var me = new google.maps.Marker({
                position: self.currentUserLocation,
                map: self.map,
                title: 'Your Location',
                icon: '/uploads/user/icon-marker.png'
            });
            $spinner.hide();
            $icon.show();
	    }, 
	    function(error) {
            console.log(error);
            $spinner.hide();
            $icon.show();
	    });
    });
}

function searchListing() 
{ 
    setTimeout(function() { 
        remove_cluster();
        
        var type          = $('select[name=type]').val();
        var district      = $('select[name=district]').val();
        var property_type = $('select[name=property_type]').val();
        var prt_type_code = $('select[name=property_type_code]').val();
        var posted        = $('select[name=posted]').val();
        var min_price     = $('input[name=listing_min_price]').val();
        var max_price     = $('input[name=listing_max_price]').val();
        var min_size      = $('input[name=listing_min_size]').val();
        var max_size      = $('input[name=listing_max_size]').val();
        var keyword       = $('input[name=keyword]').val();
        var tenure        = $('select[name=tenure]').val();
        var min_psf       = $('input[name=min_psf]').val();
        var max_psf       = $('input[name=max_psf]').val();
        
        var params = '?type='+type+'&district='+district+'&property_type='+property_type+'&property_type_code='+prt_type_code+'&posted='+posted+'&min_price='+min_price+'&max_price='+max_price+'&min_size='+min_size+'&max_size='+max_size+'&keyword='+keyword+'&min_psf='+min_psf+'&max_psf='+max_psf; 
        if(type == 2) params += '&tenure='+tenure;
        
        var i;
        
        clearMarkers();
        $.getJSON(dbPath + params, function(data) { console.log(data);
            for (i = 0; i < data.markers.length; i++) {
                var result = data.markers[i];
                var latlng = new google.maps.LatLng(parseFloat(result.center.lat), parseFloat(result.center.lng));
                addMarker(result.overlap, latlng, result.id, result.count, result.cico); 
            }
            //$('#featured').html(data.featured);
            //$('#listings').html(data.html);
            //$('#total').text(data.total);
        });
    }, 1000);
}

function custompinhover(catul){
    var image = {
        url: $('base').attr('href') + '/img/hover_' + catul
    };
    return image;
}

function returnpinhover(catul){
    var image = {
        url: $('base').attr('href') + '/img/' + catul
    };
    return image;
}

function hover_action_pin(listing_id){
    for (var i = 0; i < markers.length; i++) {        
        if ( markers[i].idul === listing_id ){
           pin_hover_storage=markers[i].catul;
           markers[i].setIcon(custompinhover(pin_hover_storage));
           markers[i].setZIndex(1031);
           markers[i].set('labelZIndex', 1031);
           markers[i].set('labelClass', 'icon-label hover');
        }
    }
}

function return_hover_action_pin(listing_id){
    for (var i = 0; i < markers.length; i++) {  
        if ( markers[i].idul === listing_id ){
            markers[i].setIcon(returnpinhover(pin_hover_storage));
            markers[i].setZIndex(1030);
            markers[i].set('labelZIndex', 1030);
            markers[i].set('labelClass', 'icon-label');
        }
    }   
}

function estanTodosEnLaMismaPosicion(markers){
    var cont = 0;
    var latitudMaster  = markers[0].getPosition().lat();
    var longitudMaster = markers[0].getPosition().lng();
    
    for(var i=0;i<markers.length;i++){
        if(markers[i].getPosition().lat() === latitudMaster & markers[i].getPosition().lng() === longitudMaster ){
            cont++;
        } else {
            return false;
        }
    }
    
    if(cont==markers.length){
        return true;
    } else if(cont<markers.length){
        return false;
    }
}

function openAllClusters() {
    var markers = oms.markersNearAnyOtherMarker();
    $.each(markers, function (i, marker) {
        //google.maps.event.trigger(markers[i], 'click');
        var label = new Label({map: map});
        var mks = oms.markersNearMarker(marker);
        if(mks) {
            label.bindTo('position', marker, 'position');
            label.set('text', mks.length + 1);
        }
    });
    if (lastInfoWindow) {
        lastInfoWindow.close();
    }
}

function OnLoad() {
	setupAddress();
	mapDiv = document.getElementById(mapDivID);
    var cLat = "1.3520865";
    var cLng = "103.8599104";
    var myLatlng = new google.maps.LatLng(cLat, cLng);
    
	var myOptions = {
		zoom: zoomLevel,
		scrollwheel: true,
		disableDoubleClickZoom: true,
		center: myLatlng,
		mapTypeControl: true,
		mapTypeControlOptions: {
            style: google.maps.MapTypeControlStyle.HORIZONTAL_BAR,
            position: google.maps.ControlPosition.BOTTOM_CENTER
		},
        zoomControl: true,
		zoomControlOptions: {
            style: google.maps.ZoomControlStyle.LARGE,
            position: google.maps.ControlPosition.TOP_RIGHT
		},
        scaleControl: true,
        scaleControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
		panControl: false,
        panControlOptions: {
            position: google.maps.ControlPosition.TOP_RIGHT
        },
		mapTypeId: google.maps.MapTypeId.ROADMAP,
		overviewMapControl: true,
		overviewMapControlOptions: {
			opened: false
		},
        streetViewControl: false,
        
        // Custom Google Map Colo Styling 
        styles: [
            {
                "featureType": "water",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#51b5f9" }
                ]
            },{
                "featureType": "road.highway",
                "elementType": "geometry.fill",
                "stylers": [
                    { "color": "#fafafa" }
                ]
            },{
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                  { "color": "#d3cfd0" }
                ]
            },{
                "featureType": "poi",
                "stylers": [
                  { "visibility": "simplified" }
                ]
            },{
                "featureType": "landscape.man_made",
                "stylers": [
                  { "color": "#f6f1ea" }
                ]
            },{
                "featureType": "road.local",
                "elementType": "geometry.fill",
                "stylers": [
                  { "color": "#ffffff" }
                ]
            },{
                "featureType": "poi",
                "elementType": "geometry.fill",
                "stylers": [
                  { "visibility": "off" }
                ]
            },{}
        ]
	};
    
    map = new google.maps.Map(mapDiv, myOptions);
    
    var geocoder = new google.maps.Geocoder();
    var address = startAddress;
    geocoder.geocode( { 'address': address}, function(results, status) {
        if (status == google.maps.GeocoderStatus.OK) {
            map.setCenter(results[0].geometry.location);
            searchListing();
        } else {
            alert("Geocode was not successful for the following reason: " + status);
        }
    });
    
    //set map radius
    /*iCircle = new InvertedCircle({
        center: map.getCenter(),
        map: map,
        radius: 5000, // 5 km
        editable: true,
        stroke_weight: 2,
        stroke_color: '#007BE8',
        always_fit_to_map: false,
        resize_updown: '../img/blank.png',
        resize_move: '../img/move.png',
        resize_leftright: '../img/drag.png'
    });*/
    
    // set info hover
    var boxText = document.createElement("div");
    var infoboxOptions = {
        content: boxText,
        disableAutoPan: true,
        maxWidth: 100,
        boxClass: "hoverbox",
        zIndex: null,			
        closeBoxMargin: "-13px 0px 0px 0px",
        closeBoxURL: "",
        infoBoxClearance: new google.maps.Size(1, 1),
        isHidden: false,
        pane: "floatPane",
        enableEventPropagation: true                   
    };              
    infoBox = new InfoBox(infoboxOptions);
    
    findMe('.find-me-button');
}


function remove_cluster() {
    $('#grid').find('.grid-list').remove();
    $('#grid .list-list').removeClass('hide');
}

$(document).ready(function () {
    $('#listing .listing-item').hover(
        function() {
            var listing_id = $(this).attr('data-id');
            hover_action_pin(listing_id);
        }, function() {
            var listing_id = $(this).attr('data-id');         
            return_hover_action_pin(listing_id);
        }
    );  
});

window.onload = function() {
    OnLoad();
    $(document).on({
        mouseenter: function () {
            //stuff to do on mouse enter
            var listing_id = $(this).attr('data-id');
            hover_action_pin(listing_id);
        },
        mouseleave: function () {
            //stuff to do on mouse leave
            var listing_id = $(this).attr('data-id');         
            return_hover_action_pin(listing_id);
        }
    }, ".listing-item"); //pass the element as an argument to .on
}