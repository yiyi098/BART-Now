var directionsService;
var directionsDisplay;

function initMap() {
  directionsService = new google.maps.DirectionsService;
  directionsDisplay = new google.maps.DirectionsRenderer;
  var map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center: {lat: 37.75, lng: -122.3}
  });
  directionsDisplay.setMap(map);
 }
  // var onChangeHandler = function() {
  //   calculateAndDisplayRoute(directionsService, directionsDisplay);
  // };
  // document.getElementById('start').addEventListener('change', onChangeHandler);
  // document.getElementById('end').addEventListener('change', onChangeHandler);
// }

function calculateAndDisplayRoute(directionsService, directionsDisplay) {
  directionsService.route({
    origin: clientLocation,
    destination: targetStation.name,
    // destination: "San Francisco",
    travelMode: currentTravelMode.toUpperCase()
  }, function(response, status) {
    if (status === 'OK') {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}