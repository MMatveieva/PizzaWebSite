/**
 * Created by Mariya on 02.03.2017.
 */

var mapp;
var home;
var directionsService;
var directionsDisplay;
var markerHome;

var deliveryAddress = $('.delivery-address-answer');

function initialize() {
//Тут починаємо працювати з картою
    home = new google.maps.LatLng(50.464379, 30.519131);

    var mapProp = {
        center: home,
        zoom: 16
    };
    var html_element = document.getElementById("googleMap");
    mapp = new google.maps.Map(html_element, mapProp);

    directionsService = new google.maps.DirectionsService();
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: mapp
    });
    directionsDisplay.setOptions({suppressMarkers: true});

    var point = new google.maps.LatLng(50.464379, 30.519131);

    var marker = new google.maps.Marker({
        position: point,
        map: mapp,
        icon: "assets/images/map-icon.png"
    });

    markerHome = new google.maps.Marker({
        position: point,
        map: mapp, //mapp - це змінна карти створена за допомогою new google.maps.Map(...)
        icon: "assets/images/map-icon.png"
    });
    markerHome.setMap(null);

    google.maps.event.addListener(mapp, 'click', function (me) {
        var coordinates = me.latLng;
        geocodeLatLng(coordinates, function (err, address) {
            if (!err) {
                markerHome.setMap(null);
//Дізналися адресу
                markerHome = new google.maps.Marker({
                    position: coordinates,
                    map: mapp, //mapp - це змінна карти створена за допомогою new google.maps.Map(...)
                    icon: "assets/images/home-icon.png"
                });
                //console.log(address);
                $('#inputAddress').val(address);
                $('.address-group').addClass("has-success");
                deliveryAddress.text(address);
                getTime(home, coordinates);
                calculateAndDisplayRoute(home, coordinates, directionsService, directionsDisplay);
            } else {
                console.log("Немає адреси")
            }
        })
    });
//Карта створена і показана
}
//Коли сторінка завантажилась
google.maps.event.addDomListener(window, 'load', initialize);

var point = new google.maps.LatLng(50.464379, 30.519131);

var marker = new google.maps.Marker({
    position: point,
    map: mapp, //mapp - це змінна карти створена за допомогою new google.maps.Map(...)
    icon: "assets/images/map-icon.png"
});

function geocodeLatLng(latlng, callback) {
//Модуль за роботу з адресою
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'location': latlng}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[1]) {
            var address = results[1].formatted_address;
            callback(null, address);
        } else {
            callback(new Error("Can't find adress"));
        }
    });
}

function geocodeAddress(address, callback) {
    markerHome.setMap(null);
    var geocoder = new google.maps.Geocoder();
    geocoder.geocode({'address': address}, function (results, status) {
        if (status === google.maps.GeocoderStatus.OK && results[0]) {
            var coordinates = results[0].geometry.location;
            //console.log("Coordinates by address" + coordinates);
            getTime(home, coordinates);
            calculateAndDisplayRoute(home, coordinates, directionsService, directionsDisplay);
            markerHome = new google.maps.Marker({
                position: coordinates,
                map: mapp,
                icon: "assets/images/home-icon.png"
            });
            deliveryAddress.text(address);
            callback(null, coordinates);
        } else {
            callback(new Error("Can not find the address"));
        }
    });
}

function calculateRoute(A_latlng, B_latlng, callback) {
    var directionService = new google.maps.DirectionsService();
    directionService.route({
        origin: A_latlng,
        destination: B_latlng,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function (response, status) {
        if (status == google.maps.DirectionsStatus.OK) {
            var leg = response.routes[0].legs[0];
            callback(null, {
                duration: leg.duration
            });
        } else {
            callback(new Error("Can' not find direction"));
        }
    });
}

function calculateAndDisplayRoute(home, marker, directionsService, directionsDisplay) {
    directionsService.route({
        origin: home,
        destination: marker,
        travelMode: google.maps.TravelMode["DRIVING"]
    }, function (response, status) {
        if (status === google.maps.DirectionsStatus.OK) {
            directionsDisplay.setDirections(response);
            // console.log("Display");
        } else {
            console.error('Directions request failed due to ' + status);
        }
    });
}

function getTime(home, marker) {
    var $time = $('.delivery-time-answer');
    calculateRoute(home, marker, function (err, data) {
        if (err) {
            console.log("Cannot get delivery time");
            $time.text("невідомий");
        }
        $time.text(data.duration.text);
        //console.log(data);
    });
}

exports.initialize = initialize;
exports.getTime = getTime;
exports.geocodeAddress = geocodeAddress;
exports.calculateAndDisplayRoute = calculateAndDisplayRoute;
exports.home = home;
exports.directionsDisplay = directionsDisplay;
exports.directionsService = directionsService;