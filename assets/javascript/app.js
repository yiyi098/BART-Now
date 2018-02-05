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
var stationDistances = [];
var possibleDestinations = [];
var destination;

var availableStations = [];
var dividedAvailableStations = []; 

var editedConvertedList = [];
var sampleStation = "San Bruno";
var trainsOfInterest = [];

var stationIndexTracker = 0;

// ===================================================
// =============== API query functions ===============
// ===================================================


//rename updateAvailableStationList ?
function updateAvailableStations() {

    var bartApiKey = "ZJBQ-5E6T-9WWT-DWE9";
    var jQueryURLAllStationInfo = "https://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&json=y&key=" + bartApiKey;

    availableStations = [];

    $.ajax({
        url: jQueryURLAllStationInfo,
        method: "GET"
    }).then(function(response) {
        for (var i = 0; i < response.root.station.length; i++) {
        	currentStation = response.root.station[i];
            availableStations.push(new bartStation(currentStation.name + ' Bart', null, currentStation.abbr, null));
        }
  	}).then(function() {
  		getStationsDistances();
  	});
}

function getStationsDistances() {
	stationIndexTracker = 0;

	//DistanceMatrix API can only take up to 25 destinations at a time
	if(availableStations.length > 25) {
		dividedAvailableStations = [];

		//divide up availableStations into arrays of 25 or less
		var numberOfQuerys = Math.floor(availableStations.length / 25) + 1;
		var leftoverNumber = availableStations.length % 25;
		for(var i = 0; i < numberOfQuerys; i++) {
			var section = [];
			for(var j = 0; j < 25; j++) {
				if(j === leftoverNumber && i === numberOfQuerys - 1) { break; }
				else {
					section.push(availableStations[(i * 25) + j].name);
				}
			}
			dividedAvailableStations.push(section);
		}

		console.log(dividedAvailableStations);
		//make the appropriate number calls to the DistanceMatrix API
		for(var i = 0; i < numberOfQuerys; i++) {
			getDistanceFromClient(dividedAvailableStations[i], stationIndexTracker);
		}

	} else {
		var stationNames = [];
		for(var i = 0; i < availableStations.length; i++) {
			stationNames.push(availableStations[i].name);
		}
		getDistanceFromClient(stationNames, stationIndexTracker);
	}
}

function getDistanceFromClient(givenDestinations, stationIndexTracker) {
	var service = new google.maps.DistanceMatrixService;
	service.getDistanceMatrix({
		origins: [clientLocation],
		destinations: givenDestinations,
		travelMode: currentTravelMode.toUpperCase(),
		unitSystem: google.maps.UnitSystem.IMPERIAL,
	}, function(response, status) {
		if (status !== 'OK') {
	        console.log('Error was: ' + status);
	    } else {
	        console.log(response);
	        for(var i = 0; i < response.destinationAddresses.length; i++) {
	        	availableStations[i + (stationIndexTracker * 25)].address = response.destinationAddresses[i];
	        	availableStations[i + (stationIndexTracker * 25)].distance = response.rows[0].elements[i].distance;
	        }
	        sortStationsByDistance();
	        stationIndexTracker++;
	    }
	});
}

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

//checkStationOfInterest();
// console.log(sampleDepartingTrains);


//using built in HTML geolocation
//https://dev.w3.org/geo/api/spec-source.html
function locationError() {
	console.log('Error: could not get location');
}
function geo_success(position) {
  	clientLocation = position.coords.latitude + ',' + position.coords.longitude;
  	console.log(clientLocation);
	
  	updateAvailableStations();

}
function geo_error() {
	console.log("Sorry, no position available.");
}
var geo_options = {
  	enableHighAccuracy: true, 
 	maximumAge        : 10000, 
 	timeout           : 7000
};

// ===================================================
// ================ Execution Starts =================
// ===================================================


//get user location
navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);



//map embed API: show map on page 2
//directions API: show route on map



function sortStationsByDistance() {
	// debugger;
	availableStations.sort(function(a, b) {
		if(a.distance == null || b.distance == null) {
			return -1;
		} else {
			return a.distance.value - b.distance.value;
		}
	});
	// debugger;
	console.log(availableStations);
}


function bartStation(name, address, abbr, distance) {
	this.name = name;
	this.address = address;
	this.abbr = abbr;
	this.distance = distance;
}