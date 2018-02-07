$(document).on('click', '.traintainer', function() {
	window.location.href = 'navigation.html';
});

$("#changeModeButton").on("click", function(event){
	console.log("i've been clicked");
	event.preventDefault();
	// $("#footer").addClass("disappear");
	$("#otherArrivalMode").modal("show");
});

$("#externalCogButton").on("click", function(event){
	console.log("i've been clicked");
	$("#sideBar").removeClass("sidebarInvisible sidebarDisappear");
	$("#sideBar").addClass("sidebarAppear");
});

$("#sidebarInternalCog").on("click", function(event){
	console.log("i've been clicked");
	$("#sideBar").removeClass("sidebarAppear");
	$("#sideBar").addClass("sidebarDisappear");
});

$("#otherStation-btn").on("click", function(event){
	console.log("i've been clicked");
	event.preventDefault();
	$("#otherStations").modal("show");
});

$("#closeButton").on("click", function(event){
	console.log("i've been clicked");
	event.preventDefault();
	$("#otherStations").removeClass("sidebarAppear");
	$("#otherStations").addClass("sidebarDisappear");
});


function updateStationName() {
	$('#stationName').text(targetStation.name);
}

//  create the buttons for viewing the next trains

function createTrainButtons() {
	for (i = 0; i < filteredTrains.length; i++) {
		//structure of the traintainer
		var traintainer = $("<div class='traintainer'>");
		var row1 = $("<div class='trainButtonRow row1'>");
		var row2 = $("<div class='trainButtonRow row2'>");
		
		//color of the train's line
		var color = filteredTrains[i].hexcolor;
		var line = $("<div class='colors'>");
		line.css("background-color", color);
		
		//time until the train's arrival
		var minutes = filteredTrains[i].eta;
		var seconds = 0;
		
		var trainImage = $("<img src='assets/images/train.png' width='32px' height='32px' class='trainImage'>");
		
		var lineColorSpan = $("<span class='lineColorSpan'>");
		
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
		row1.text(filteredTrains[i].destination);
		
		traintainer.append(row1);
		traintainer.append(row2);
		traintainer.attr('cursor', 'pointer');
		
		$("#nextArrivingTrains").append(traintainer);
	}
	var viewMoreTrainsButton = $("<button class='btn-clear btn' id='seeMoreTrainsButton'>");
	var seeSpan = $('<span id="seeSpan">');
    seeSpan.text("view");
    viewMoreTrainsButton.append(seeSpan);
    viewMoreTrainsButton.append("more trains");
    $("#nextArrivingTrains").append(viewMoreTrainsButton);
}

// $(document).ready(function(){
// 	createTrainButtons();
// })


