$(document).on('click', '.traintainer', function(event) {
	window.sessionStorage.setItem('selectedTrain', $(this).attr('data-backendTrain'));
	window.location.href = 'navigation.html';
});

$("#externalCogButton").on("click", function(event){
	$("#sideBar").removeClass("sidebarInvisible sidebarDisappear");
	$("#sideBar").addClass("sidebarAppear");
});

$("#sidebarInternalCog").on("click", function(event){
	$("#sideBar").removeClass("sidebarAppear");
	$("#sideBar").addClass("sidebarDisappear");
});

$('.preferenceOption').on('click', function() {
	if($(this).text().includes('Travel')) {
		$("#travelPreferenceMenu").modal("show");
	} else if($(this).text().includes('Station')) {
		populateStationList();
		$("#stationPreferenceMenu").modal("show");
	} else if($(this).text().includes('Train')) {
		$("#trainPreferenceMenu").modal("show");
	}
});

$('.travelPreferenceOption').on('click', function() {
	preferenceTravelMode = $(this).text();
	localStorage.setItem('preferenceTravelMode', $(this).text());
	updatePreferenceUI();
	$("#travelPreferenceMenu").modal("hide");
});

$(document).on('click', '.stationPreferenceOption', function() {
	if ($(this).text() === 'all') { 
		preferenceStation = availableStations[0];
		localStorage.setItem('preferenceStation', null);
		chosenStation = null;
	} else {
		for(var i = 0; i < backupStationList.length; i++) {
			if(backupStationList[i].name === $(this).text()) {
				preferenceStation = backupStationList[i];
				localStorage.setItem('preferenceStation', JSON.stringify(backupStationList[i]));
				chosenStation = preferenceStation;
				break;
			}
		}
	}
	updatePreferenceUI();
	refreshTrainList();
	$("#stationPreferenceMenu").modal("hide");
});

function populateStationList() {
	$('#stationPreferenceList').empty();
	
	var defaultOption = $('<li>');
	defaultOption.addClass('stationPreferenceOption');
	defaultOption.text('Nearest Station');
	$('#stationPreferenceList').append(defaultOption);

	for(var i = 0; i < backupStationList.length; i++) {
		var option = $('<li>');
		option.addClass('stationPreferenceOption');
		option.text(backupStationList[i].name);
		$('#stationPreferenceList').append(option);
	}
}

$('.trainPreferenceOption').on('click', function() {
	preferenceDestination = $(this).text();
	localStorage.setItem('preferenceDestination', $(this).text());
	updatePreferenceUI();
	$("#trainPreferenceMenu").modal("hide");
});

function updatePreferenceUI() {
	var travelMode = localStorage.getItem('preferenceTravelMode');
	if(travelMode === null) { travelMode = "none"; }
	var station = JSON.parse(localStorage.getItem('preferenceStation'));
	if(station === null) { station = "nearest"; }
	else { station = station.name; }
	var train = localStorage.getItem('preferenceTrain');
	if(train === null) { train = "all"; }

	$('#travelPreference').text(travelMode);
	$('#stationPreference').text(station);
	$('#trainPreference').text(train);
}

$("#otherStation-btn").on("click", function(event){
	console.log("i've been clicked");
	event.preventDefault();
	$('#otherStationsList').empty();
	$("#otherStations").modal("show");

	var nearestStationOption = $('<li>');
	nearestStationOption.text('Show Nearest Station');
	nearestStationOption.addClass('stationOption');
	$('#otherStationsList').append(nearestStationOption);

	for(var i = 0; i < availableStations.length; i++) {
		if(availableStations[i].name != targetStation.name) {
			var station = $('<li>');
			station.text(availableStations[i].name);
			station.addClass('stationOption');
			$('#otherStationsList').append(station);
		}
	}
});

$(document).on('click', '.stationOption', function(event) {
	var stationName = event.target.innerHTML;
	if(stationName === 'Show Nearest Station') {
		chosenStation = null;
		targetStation = availableStations[0]; //set it to the nearest station
	} else {
		for(var i = 0; i < availableStations.length; i++) {
			if(availableStations[i].name === stationName) {
				chosenStation = availableStations[i];
				targetStation = chosenStation;
				break;
			}
		}
	}
	actualTimeLimit = defaultTimeLimit;
	refreshTrainList(); //updates the UI
	$("#otherStations").modal("hide");
});

$("#closeButton").on("click", function(event){
	event.preventDefault();
	$("#otherStations").removeClass("sidebarAppear");
	$("#otherStations").addClass("sidebarDisappear");
});

$("#changeModeButton").on("click", function(event){
	event.preventDefault();
	// $("#footer").addClass("disappear");
	$("#otherArrivalMode").modal("show");
});

$(".travelOption").on('click', function() {
	currentTravelMode = $(this).text();
	window.sessionStorage.setItem('currentTravelMode', currentTravelMode);
	$('#otherArrivalMode').modal('hide');
});

$(document).on('click', '#seeMoreTrainsButton', function() {
	actualTimeLimit += 60;
	refreshTrainList();
})

function updateStationName() {
	$('#stationName').text(targetStation.name);
}

//  create the buttons for viewing the next trains
function createTrainButtons() {
	$('#nextArrivingTrains').empty();

	for (i = 0; i < filteredTrains.length; i++) {
		var traintainer = createTraintainer(filteredTrains[i]);
		$("#nextArrivingTrains").append(traintainer);
	}

	//to the end of the list, append the 'seeMoreTrainsButton'
	var viewMoreTrainsButton = $("<button class='btn-clear btn' id='seeMoreTrainsButton'>");
	var seeSpan = $('<span id="seeSpan">');
    seeSpan.text("view");
    viewMoreTrainsButton.append(seeSpan);
    viewMoreTrainsButton.append("more trains");
    $("#nextArrivingTrains").append(viewMoreTrainsButton);
    var deadSpace = $("<div id='deadSpace'>");
    $("#nextArrivingTrains").append(deadSpace);
}

function createTraintainer(dynamicTrain) {
	//structure of the traintainer
	var traintainer = $("<div class='traintainer'>");
	var row1 = $("<div class='trainButtonRow row1'>");
	var row2 = $("<div class='trainButtonRow row2'>");

	//color of the train's line
	var color = dynamicTrain.hexcolor;
	var line = $("<div class='colors'>");
	line.css("background-color", color);
	
	//time until the train's arrival
	var minutes = dynamicTrain.eta;
	var seconds = 0;  // <---- for further possible future expansion...
	
	var trainImage = $("<img src='assets/images/train.png' width='50px' height='50px' class='trainImage'>");		
	var minutesSpan = $("<span class='minutesSpan'>");
	var minsSpan = $("<span class='minsSpan'>");
	var secondsSpan = $("<span class='secondsSpan'>");
	var sSpan = $("<span class='sSpan'>");
	minutesSpan.text(minutes);
	minsSpan.text("mins");
	secondsSpan.text(seconds);
	sSpan.text("s");
		
	row2.append(trainImage);
	row2.append(line);
	row2.append(minutesSpan);
	row2.append(minsSpan);
	row2.append(secondsSpan);
	row2.append(sSpan);
	row1.text(dynamicTrain.destination);
		
	traintainer.append(row1);
	traintainer.append(row2);
	traintainer.attr('cursor', 'pointer');

	traintainer.attr('data-backendTrain', JSON.stringify(dynamicTrain));
	return(traintainer);
}