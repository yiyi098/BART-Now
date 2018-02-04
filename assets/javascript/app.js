var config = {
  apiKey: "AIzaSyC8avdmmVtB4qWz48G6f7aNg3g-KwbQ1WU",
  authDomain: "project-1-e130c.firebaseapp.com",
  databaseURL: "https://project-1-e130c.firebaseio.com",
  projectId: "project-1-e130c",
  storageBucket: "project-1-e130c.appspot.com",
  messagingSenderId: "1051617829929"
};

firebase.initializeApp(config);

var availableStations = [];

var sampleStation = "San Bruno";

var sampleDepartingTrains = [];

var trainsOfInterest = [];

function bartAvailableStationList() {

  var bartApiKey = "ZJBQ-5E6T-9WWT-DWE9";
  var jQueryURLAllStationInfo = "https://api.bart.gov/api/etd.aspx?cmd=etd&orig=all&json=y&key=" + bartApiKey;

  $.ajax({
  url: jQueryURLAllStationInfo,
  method: "GET"
  }).then(function(response) {
    for (var i = 0; i < response.root.station.length; i++) {
      availableStations.push(response.root.station[i].name);
    }
  });
}

bartAvailableStationList();

console.log(availableStations);

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
        // for (var i = 0; i < trainsOfInterest.length; i++) {
          // sampleDepartingTrains.push(trainsOfInterest[i]);
        // }
      }
    }
  });
}

checkStationOfInterest();


// console.log(sampleDepartingTrains);











