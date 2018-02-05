$("#otherStation-btn").on("click", function(event){
	console.log("i've been clicked");
	event.preventDefault();
	$("#footer").addClass("disappear");
});

$("#sidebarCogButton").on("click", function(event){
	console.log("i've been clicked");
	$("#sideBar").removeClass("sidebarInvisible");
	$("#sideBar").addClass("sidebarAppear");
});