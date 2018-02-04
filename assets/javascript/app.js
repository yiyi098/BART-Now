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
var destination = ''; //will be provided from BART

//geolocation API: get user location
var locationApiKey = 'AIzaSyDz-OZA8ma5o7FDPJbEYDN9DgmU4OxBEOg';
var locationRequest = 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + locationApiKey;
//https://code.tutsplus.com/tutorials/an-introduction-to-the-geolocation-api--cms-20071
if (window.navigator && window.navigator.geolocation) {
   console.log('something');
} else {
   // Not supported
}

//distance API: get eta and distance
var distanceMatrixApiKey = 'AIzaSyAmyDgw_JZ0uIEzvtYrt-550EhSy1ME5MU';
var distanceRequestUrlBase = 'https://maps.googleapis.com/maps/api/distancematrix/json/?';
var distanceRequest;
function updateDistanceRequest() {
	distanceRequest = `${distanceRequestUrlBase}mode=${transportMode}&
	origins=${clientLocation}&destination=${destination}&units=imperial&key=${distanceMatrixApiKey}`;
}
distanceRequest = updateDistanceRequest();

//map embed API: show map on page 2

//directions API: show route on map