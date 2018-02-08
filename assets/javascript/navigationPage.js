updatePreferenceUI();
// draw data from session storage from the inital page
clientLocation = window.sessionStorage.getItem('clientLocation');
currentTravelMode = window.sessionStorage.getItem('currentTravelMode');
targetStation = JSON.parse(window.sessionStorage.getItem('targetStation'));
selectedTrain = JSON.parse(window.sessionStorage.getItem('selectedTrain'));
var distance = targetStation.distance.text;
var travelTime = targetStation.travelTime.text;
var backButton = $("<button class='backButton'>");
backButton.text("back to trains");
backButton.on("click", function(){
	window.location.replace("https://yiyi098.github.io/BART-Now/");
});

var trainCountdownIntervalID;
var chance;
var travelTimeInt = parseInt(travelTime.slice(0, travelTime.indexOf("m")-1));

$(document).ready(function() {
	initMap();
    calculateAndDisplayRoute(directionsService, directionsDisplay);
	$('#selectedTrain').append(createTraintainer(selectedTrain));

	trainCountdownIntervalID = setInterval(countDown, 60000); 
	
  	$("#distanceToBart").html(
		'Distance to BART station: <span id="distance">' + distance + '</span>');

	$("#estimatedTravelTime").html(
		'Estimated ' + currentTravelMode + ' time: <span id="minutesFromStation" class="minutesSpan">' + travelTime + '</span>');
// to determine a rough chance of being able to catch the selected train
	if (travelTimeInt > selectedTrain.eta+1) {
		chance = "low";
		$("#estimatedChance").html(
			'Chance of catching this train: <span class="chance" id=' + chance + '>LOW</span>');
	}
	else if (travelTimeInt >= selectedTrain.eta-1) {
		chance = "medium";
		$("#estimatedChance").html(
			'Catch it? <span class="chance" id=' + chance + '>cutting it close...</span>');
	}
	else {
		chance = "high";
		$("#estimatedChance").html(
			'Chance of catching this train: <span class="chance" id=' + chance + '>high</span>');
	}
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