$(document).ready(function() {
	initMap();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
	$('#selectedTrain').append(selectedTrain);
});