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
var actualTimeLimit = defaultTimeLimit;
var clientLocation;
var destination; //the selected bart station

var availableStations = [];
var dividedAvailableStations = []; 

//variable that stores which ajax call for station locations we're on
var stationIndexTracker = 0;

var stationsAreSorted = false;
var stationsSortedIntervalID;

var trainsOfInterest = [];
var dynamicTrains = [];
var filteredTrains = [];

// ===================================================
// =============== API query functions ===============
// ===================================================


//rename updateAvailableStationList ?
function updateAvailableStations() {

    var bartApiKey = "ZJBQ-5E6T-9WWT-DWE9";
    var jQueryURLAllStationInfo = "https://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&json=y&key=" + bartApiKey;

    availableStations = [];
    stationsAreSorted = false;

    $.ajax({
        url: jQueryURLAllStationInfo,
        method: "GET"
    }).then(function(response) {
        for (var i = 0; i < response.root.station.length; i++) {
        	currentStation = response.root.station[i];
            availableStations.push(new bartStation(currentStation.name + ' Bart', null, currentStation.abbr, null, null));
        }
  	}).then(function() {
  		getStationsDistances();
  	});
  	stationsSortedIntervalID = setInterval(checkStationsSorted, 2000);
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
			getDistanceFromClient(dividedAvailableStations[i]);
		}

	} else {
		var stationNames = [];
		for(var i = 0; i < availableStations.length; i++) {
			stationNames.push(availableStations[i].name);
		}
		getDistanceFromClient(stationNames);
	}
}

function getDistanceFromClient(givenDestinations) {
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
	        	availableStations[i + (stationIndexTracker * 25)].travelTime = response.rows[0].elements[i].duration;
	        }
	        sortStationsByDistance();
	        stationIndexTracker++;
	    }
	});
}

function checkStationOfInterest() {

    var bartApiKey = "ZJBQ-5E6T-9WWT-DWE9";
    var jQueryURLAllStationInfo = "https://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + destination.abbr + "&json=y&key=" + bartApiKey;

    dynamicTrains = [];

    $.ajax({
    url: jQueryURLAllStationInfo,
    method: "GET"
    }).then(function(response) {
        trainsOfInterest = response.root.station[0].etd; 
        console.log(response);
        for(var i = 0; i < trainsOfInterest.length; i++) {
        	for(var j = 0; j < trainsOfInterest[i].estimate.length; j++) {
        		var train = new dynamicTrain(
	        		trainsOfInterest[i].destination, 
	        		trainsOfInterest[i].estimate[j].direction,
	        		trainsOfInterest[i].estimate[j].platform,
	        		trainsOfInterest[i].estimate[j].color,
	        		trainsOfInterest[i].estimate[j].hexcolor,
	        		trainsOfInterest[i].estimate[j].minutes,
	        		trainsOfInterest[i].estimate[j].delay
        		);
        		dynamicTrains.push(train);
        	}
        }
        sortDyanmicTrains();
        console.log(dynamicTrains);
        filterTrains();
        console.log('Filtered Trains: ');
        console.log(filteredTrains);
    });
}

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

// ===================================================
// ================ Helper Functions =================
// ===================================================


function sortStationsByDistance() {
	availableStations.sort(function(a, b) {
		if(a.distance == null && b.distance == null) {
			return 0;
		} else if(a.distance == null) {
			return 1; //a goes last
		} else if(b.distance == null) {
			return -1; //b goes last
		} else {
			return a.distance.value - b.distance.value;
		}
	});

	console.log(availableStations);

	stationsAreSorted = availableStations.every(function(station) {
		return station.distance != null;
	});
}

function checkStationsSorted() {
  	if(stationsAreSorted) {
  		clearInterval(stationsSortedIntervalID);
  		destination = availableStations[0];
  		checkStationOfInterest();
  	}
}

function sortDyanmicTrains() {
	dynamicTrains.sort(function(a, b) {
		if(parseInt(a.eta) == 'NaN' && b.parseInt(b.eta) == 'NaN') {
			return 0;
		} else if(parseInt(a.eta) == 'NaN') {
			return -1; //a is proably 'leaving' so it goes first
		} else if(parseInt(b.eta) == 'NaN') {
			return 1; //b probably 'leaving'
		} else {
			return parseInt(a.eta) - parseInt(b.eta); 
		}
	});
}

function filterTrains() {
	filteredTrains = [];

	//filter trains leaving too soon:
	//eliminate impossible trains, or those below the user's possibilty threshold
	//will need to get google's travel-time to the station
	
	//filter trains leaving too far away:
	for(var i = 0; i < dynamicTrains.length; i++) {
		if(typeof dynamicTrains[i].eta === 'number') {
			if(dynamicTrains[i].eta <= actualTimeLimit) {
				filteredTrains.push(dynamicTrains[i]);
			}
		} else {
			filteredTrains.push(dynamicTrains[i]);
		}
	}
}


// ===================================================
// =============== Object Constructors ===============
// ===================================================

function bartStation(name, address, abbr, distance, travelTime) {
	this.name = name;
	this.address = address;
	this.abbr = abbr;
	this.distance = distance;
	this.travelTime = travelTime;
}

function dynamicTrain(destination, direction, platform, color, hexcolor, minutes, delay) {
	this.destination = destination;
	this.direction = direction;
	this.platform = platform;
	this.color = color;
	this.hexcolor = hexcolor;
	this.minutes = minutes;
	this.delay = delay;
	if(parseInt(minutes) != 'NaN' && parseInt(delay) != 'NaN') {
		this.eta = parseInt(minutes) + parseInt(delay);
	} else {
		this.eta = minutes;
	}
}