clientLocation = window.sessionStorage.getItem('clientLocation');
currentTravelMode = window.sessionStorage.getItem('currentTravelMode');
targetStation = JSON.parse(window.sessionStorage.getItem('targetStation'));
selectedTrain = JSON.parse(window.sessionStorage.getItem('selectedTrain'));

$(document).ready(function() {
	initMap();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
	$('#selectedTrain').append(createTraintainer(selectedTrain));
});



$("#navStationName").text(targetStation.name);