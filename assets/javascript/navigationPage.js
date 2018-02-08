updatePreferenceUI();

clientLocation = window.sessionStorage.getItem('clientLocation');
currentTravelMode = window.sessionStorage.getItem('currentTravelMode');
targetStation = JSON.parse(window.sessionStorage.getItem('targetStation'));
selectedTrain = JSON.parse(window.sessionStorage.getItem('selectedTrain'));
var distance = targetStation.distance.text;
var travelTime = targetStation.travelTime.text;

var backButton = $("<button class='backButton'>");
backButton.html("<a href='https://yiyi098.github.io/BART-Now/'>back to trains</a>");

// backButton.text("back to trains");


var trainCountdownIntervalID;

$(document).ready(function() {
	initMap();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
	$('#selectedTrain').append(createTraintainer(selectedTrain));

	trainCountdownIntervalID = setInterval(countDown, 60000); 
	
  $("#distanceToBart").html(
		'Distance to BART station: <span id="distance">' + distance + '</span>');

	$("#estimatedTravelTime").html(
		'Estimated ' + currentTravelMode + ' time: <span id="minutesFromStation" class="minutesSpan">' + travelTime + '</span>');
	$("#backButtonDiv").append(backButton);

});

$("#navStationName").text(targetStation.name);

function countDown() {
	selectedTrain.eta--;
	$('.traintainer').find('.minutesSpan').text(selectedTrain.eta);
	if(selectedTrain.eta === 0) {
		clearInterval(trainCountdownIntervalID);
	}
}