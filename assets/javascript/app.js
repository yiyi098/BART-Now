var config = {
    apiKey: "AIzaSyC8avdmmVtB4qWz48G6f7aNg3g-KwbQ1WU",
    authDomain: "project-1-e130c.firebaseapp.com",
    databaseURL: "https://project-1-e130c.firebaseio.com",
    projectId: "project-1-e130c",
    storageBucket: "project-1-e130c.appspot.com",
    messagingSenderId: "1051617829929"
};
firebase.initializeApp(config);


// ===================================================
// ==== Variables for App settings and API calls =====
// ===================================================


var currentTravelMode = 'walking';
var defaultTimeLimit = 30;
var actualTimeLimit = defaultTimeLimit;
var clientLocation;
var targetStation; //the selected bart station

var availableStations = [];
var dividedAvailableStations = []; 


var distanceCallsStatuses = [];
//variable that stores which ajax call for station locations we're on
var stationIndexTracker = 0;
var prevResponseLength = 0;

var stationsAreSorted = false;
var stationsSortedIntervalID;

var trainsOfInterest = [];
var dynamicTrains = [];
var filteredTrains = [];


// ===================================================
// ================ Execution Starts =================
// ===================================================


//get user location
navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);


// ===================================================
// =============== API query functions ===============
// ===================================================


//get client location using built in HTML geolocation
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

//query the BART api to get the currently active stations
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
    }).done(function() {
      getStationsDistances();
    });
    stationsSortedIntervalID = setInterval(checkStationsSorted, 1000);
}

//query Google API to get the distance
//from the client to every station in avaliableStations
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

    var distanceIntervalIDs = [];

    console.log(dividedAvailableStations);
    //make the appropriate number calls to the DistanceMatrix API
    for(var i = 0; i < numberOfQuerys; i++) {
      if(i === 0) { 
        distanceCallsStatuses.push(false);
        getDistanceToStationsFromClient(dividedAvailableStations[i]);
      } 
      else {
        distanceCallsStatuses.push(false);
        var index = i;
        distanceIntervalIDs[i] = setInterval(function() {
          checkDistanceCallCompleted(distanceIntervalIDs, index);
        }, 500);
      }
    }

  } else {
    var stationNames = [];
    for(var i = 0; i < availableStations.length; i++) {
      stationNames.push(availableStations[i].name);
    }
    getDistanceToStationsFromClient(stationNames);
  }
}

//called by getStationsDistance, the actual API call to google distance matrix
//gets the distance of up to 25 stations at a time
function getDistanceToStationsFromClient(givenDestinations) {
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
            availableStations[i + (stationIndexTracker * prevResponseLength)].address = response.destinationAddresses[i];
            availableStations[i + (stationIndexTracker * prevResponseLength)].distance = response.rows[0].elements[i].distance;
            availableStations[i + (stationIndexTracker * prevResponseLength)].travelTime = response.rows[0].elements[i].duration;
          }
          prevResponseLength = response.destinationAddresses.length;
          distanceCallsStatuses[stationIndexTracker] = true;
          stationIndexTracker++;
          //if this was the final call to google's api
          if(stationIndexTracker > (availableStations.length / 25)) {
            sortStationsByDistance();
          }
      }
  });
}

//queries the BART api to get all the train
//info of the selected station (var targetStation)
function checkStationOfInterest() {

    var bartApiKey = "ZJBQ-5E6T-9WWT-DWE9";
    var jQueryURLAllStationInfo = "https://api.bart.gov/api/etd.aspx?cmd=etd&orig=" + targetStation.abbr + "&json=y&key=" + bartApiKey;

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
        initMap();
        calculateAndDisplayRoute(directionsService, directionsDisplay);
        console.log('Filtered Trains: ');
        console.log(filteredTrains);
    });
}


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
      //make sure this only runs one time
      stationsAreSorted = false;
      
      clearInterval(stationsSortedIntervalID);
      targetStation = availableStations[0];
      console.log(targetStation.name);
      checkStationOfInterest();
    }
}

function checkDistanceCallCompleted(distanceIntervalIDs, i) {
  if(distanceCallsStatuses[i-1]) {
    clearInterval(distanceIntervalIDs[i]);
    getDistanceToStationsFromClient(dividedAvailableStations[i]);
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