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
//get the location of all the bart locations
var stationLocations = bartStationsOld.join('|');

var availableStations = [];
var editedConvertedList = [];
var sampleStation = "San Bruno";
var trainsOfInterest = [];

function bartAvailableStationList() {

    var bartApiKey = "ZJBQ-5E6T-9WWT-DWE9";
    var jQueryURLAllStationInfo = "https://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&json=y&key=" + bartApiKey;

    $.ajax({
        url: jQueryURLAllStationInfo,
        method: "GET"
    }).then(function(response) {
        var tempList = [];
        var convertedList = [];
        for (var i = 0; i < response.root.station.length; i++) {
            availableStations.push(response.root.station[i].name);
            var temp = availableStations[i].split(" ");
            tempList.push(temp);
            /*
            //no need for tempList or editedConvertedList
            var formattedStation = temp.join("+") + "+bart+station";
            convertedList.push(formattedStation);
            */
            convertedList.push(tempList[i].join("+"));
            editedConvertedList.push(convertedList[i] + "+bart+station");
        }
  });
}

bartAvailableStationList();
console.log(editedConvertedList);

function checkStationOfInterest() {

    var bartApiKey = "ZJBQ-5E6T-9WWT-DWE9";
    var jQueryURLAllStationInfo = "https://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&json=y&key=" + bartApiKey;

    $.ajax({
    url: jQueryURLAllStationInfo,
    method: "GET"
    }).then(function(response) {
        for (var i = 0; i < response.root.station.length; i++) {
            if (response.root.station[i].name === sampleStation) {
            trainsOfInterest = response.root.station[i].etd;
            console.log(trainsOfInterest);
            }
        }
    });
}

checkStationOfInterest();
// console.log(sampleDepartingTrains);


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
		destinations: availableStations,
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