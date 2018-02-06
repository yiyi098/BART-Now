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
	// $("#otherStations").removeClass("sidebarInvisible sidebarDisappear");
	// $("#otherStations").addClass("sidebarAppear");
});

$("#closeButton").on("click", function(event){
	console.log("i've been clicked");
	event.preventDefault();
	$("#otherStations").removeClass("sidebarAppear");
	$("#otherStations").addClass("sidebarDisappear");
});

function createTrainButtons() {

	var traintainer = $("<button>");

	var row1 = $("<div class='row'>");



}