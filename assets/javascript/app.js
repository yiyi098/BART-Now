var config = {
  apiKey: "AIzaSyC8avdmmVtB4qWz48G6f7aNg3g-KwbQ1WU",
  authDomain: "project-1-e130c.firebaseapp.com",
  databaseURL: "https://project-1-e130c.firebaseio.com",
  projectId: "project-1-e130c",
  storageBucket: "project-1-e130c.appspot.com",
  messagingSenderId: "1051617829929"
};
firebase.initializeApp(config);

var currentTravelMode = 'walking';
var defaultTimeLimit = 30;
var clientLocation;// = '37.872591199999995,-122.29373170000001';
var destination;
var bartStationsOld = ['Rockridge+Bart', 'Downtown+Berkeley+Bart']; //supplied by bart api
var bartStations = ['Rockridge Bart', 'Downtown Berkeley Bart']; //supplied by bart api

//get the location of all the bart locations
var stationLocations = bartStationsOld.join('|');


//distance API: get eta and distance
var distanceMatrixApiKey = 'AIzaSyAmyDgw_JZ0uIEzvtYrt-550EhSy1ME5MU';
var distanceRequestUrlBase = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
var distanceRequest;
function updateDistanceRequest() {
	distanceRequest = `${distanceRequestUrlBase}mode=${currentTravelMode}&origins=${clientLocation}&destinations=${stationLocations}&units=imperial&key=${distanceMatrixApiKey}`;
}


//using built in HTML geolocation
//https://dev.w3.org/geo/api/spec-source.html
function locationError() {
	console.log('Error: could not get location');
}
function geo_success(position) {
  	clientLocation = position.coords.latitude + ',' + position.coords.longitude;
  	console.log(clientLocation);
  	
  	updateDistanceRequest();
	console.log(distanceRequest);
	
	var service = new google.maps.DistanceMatrixService;
	service.getDistanceMatrix({
		origins: [clientLocation],
		destinations: bartStations,
		travelMode: currentTravelMode.toUpperCase(),
		unitSystem: google.maps.UnitSystem.IMPERIAL,
	}, function(response, status) {
		if (status !== 'OK') {
            alert('Error was: ' + status);
        } else {
        	console.log(response);
        }
	});
}
function geo_error() {
	console.log("Sorry, no position available.");
}
var geo_options = {
  	enableHighAccuracy: true, 
 	maximumAge        : 30000, 
 	timeout           : 27000
};

navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);



//map embed API: show map on page 2
//directions API: show route on map

