var config = {
  apiKey: "AIzaSyC8avdmmVtB4qWz48G6f7aNg3g-KwbQ1WU",
  authDomain: "project-1-e130c.firebaseapp.com",
  databaseURL: "https://project-1-e130c.firebaseio.com",
  projectId: "project-1-e130c",
  storageBucket: "project-1-e130c.appspot.com",
  messagingSenderId: "1051617829929"
};
firebase.initializeApp(config);

var transportMode = 'walking';
var defaultTimeLimit = 30;
var clientLocation = '';
var destination;
var bartStations = ['Rockridge+Bart', 'Downtown+Berkeley+Bart'];

//get the location of all the bart locations
var stationLocations = bartStations.join('|');

//using built in HTML geolocation
//https://dev.w3.org/geo/api/spec-source.html
function locationError() {
	console.log('Error: could not get location');
}
function geo_success(position) {
  clientLocation = position.coords.latitude + ',' + position.coords.longitude;
  console.log(clientLocation);
}
function geo_error() {
  alert("Sorry, no position available.");
}
var geo_options = {
  enableHighAccuracy: true, 
  maximumAge        : 30000, 
  timeout           : 27000
};
navigator.geolocation.watchPosition(geo_success, geo_error, geo_options);

//distance API: get eta and distance
var distanceMatrixApiKey = 'AIzaSyAmyDgw_JZ0uIEzvtYrt-550EhSy1ME5MU';
var distanceRequestUrlBase = 'https://maps.googleapis.com/maps/api/distancematrix/json/?';
var distanceRequest;
function updateDistanceRequest() {
	distanceRequest = `${distanceRequestUrlBase}mode=${transportMode}&
	origins=${clientLocation}&destinations=${stationLocations}&units=imperial&key=${distanceMatrixApiKey}`;
}
updateDistanceRequest();

console.log(distanceRequest);

// https://maps.googleapis.com/maps/api/distancematrix/json?units=imperial&origins=40.6655101,-73.89188969999998&destinations=enc:_kjwFjtsbMt%60EgnKcqLcaOzkGari%40naPxhVg%7CJjjb%40cqLcaOzkGari%40naPxhV:&key=YOUR_API_KEY
// https://maps.googleapis.com/maps/api/distancematrix/json/?mode=walking&%20origins=&destination=Rockridge+Bart|Downtown+Berkeley+Bart&units=imperial&key=AIzaSyAmyDgw_JZ0uIEzvtYrt-550EhSy1ME5MU




//map embed API: show map on page 2
//directions API: show route on map

