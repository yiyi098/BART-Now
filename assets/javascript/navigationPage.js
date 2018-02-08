updatePreferenceUI();

clientLocation = window.sessionStorage.getItem('clientLocation');
currentTravelMode = window.sessionStorage.getItem('currentTravelMode');
targetStation = JSON.parse(window.sessionStorage.getItem('targetStation'));
selectedTrain = JSON.parse(window.sessionStorage.getItem('selectedTrain'));

var trainCountdownIntervalID;

$(document).ready(function() {
	initMap();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
	$('#selectedTrain').append(createTraintainer(selectedTrain));

	trainCountdownIntervalID = setInterval(countDown, 60000); 

	$("#estimatedTravelTime").html(
		'Estimated ' + currentTravelMode + ' time: <span id="minutesFromStation" class="minutesSpan"><span class="minsSpan">mins</span>');

});

$("#navStationName").text(targetStation.name);

function countDown() {
	selectedTrain.eta--;
	$('.traintainer').find('.minutesSpan').text(selectedTrain.eta);
	if(selectedTrain.eta === 0) {
		clearInterval(trainCountdownIntervalID);
	}
}