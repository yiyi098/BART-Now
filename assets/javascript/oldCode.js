//geolocation API: get user location
var locationApiKey = 'AIzaSyDz-OZA8ma5o7FDPJbEYDN9DgmU4OxBEOg';
var locationRequest = 'https://www.googleapis.com/geolocation/v1/geolocate?key=' + locationApiKey;
navigator.geolocation.getCurrentPosition(locationSuccess, locationError, {maximumAge:60000, enableHighAccuracy: true});
function locationSuccess(position) {
	clientLocation = position;
	console.log(position);
}
//trying to use ajax
$.ajax({
	url: locationRequest,
    method: "GET"
}).done(function(response) {
	console.log(locationRequest);
	console.log(response);
});
//trying to use google
//https://developers.google.com/api-client-library/javascript/start/start-js
function getLocation() {
	gapi.client.init({
		'apiKey': locationApiKey
	}).then(function(){
		return gapi.client.request({
			'path' : locationRequest
		})
	}).then(function(response){
		console.log(response.result);
	}, function(reason) {
		console.log('Error: ' + reason.result.error.message);
	});
}
gapi.load('client', getLocation);