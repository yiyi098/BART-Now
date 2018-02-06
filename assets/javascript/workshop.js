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

//  create the buttons for viewing the next trains
var soonestTrains = ["Pittsburg/Bay Point", "Warm Springs", "Dublin/Pleasanton", "SF Airport"];

function createTrainButtons() {
	for (i = 0; i < soonestTrains.length; i++) {
		var traintainer = $("<div class='traintainer'>");
		var row1 = $("<div class='trainButtonRow row1'>");
		var row2 = $("<div class='trainButtonRow row2'>");
		var color = "yellow";
		var line = $("<img src='assets/images/' + color + '.png' class='trainColors'>");
		var minutes = "4";
		var seconds = "37";
		var trainImage = $("<img src='assets/images/train.png' width='32px' height='32px' class='trainImage'>");
		var lineColorSpan = $("<span class=lineColorSpan>");
		var minutesSpan = $("<span class='minutesSpan'>");
		var minsSpan = $("<span class='minsSpan'>");
		var secondsSpan = $("<span class='secondsSpan'>");
		var sSpan = $("<span class='sSpan'>");
		minutesSpan.text(minutes);
		minsSpan.text("mins");
		secondsSpan.text(seconds);
		sSpan.text("s");
		row2.append(trainImage);
		row2.append(lineColorSpan);
		row2.append(minutesSpan);
		row2.append(minsSpan);
		row2.append(secondsSpan);
		row2.append(sSpan);
		row1.text(soonestTrains[i]);
		traintainer.append(row1);
		traintainer.append(row2);
		$("#nextArrivingTrains").append(traintainer);
	}
}

$(document).ready(function(){
	createTrainButtons();
})


