//trying to use ajax for location
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

//trying to use URL for distance api
//distance API: get eta and distance
var distanceMatrixApiKey = 'AIzaSyAmyDgw_JZ0uIEzvtYrt-550EhSy1ME5MU';
var distanceRequestUrlBase = 'https://maps.googleapis.com/maps/api/distancematrix/json?';
var distanceRequest;
function updateDistanceRequest() {
	distanceRequest = `${distanceRequestUrlBase}mode=${currentTravelMode}&origins=${clientLocation}&destinations=${stationLocations}&units=imperial&key=${distanceMatrixApiKey}`;
}

//old way of formatting the station list
// var temp = availableStations[i];
            // .split(" ");
            // tempList.push(temp);
            
            // //no need for tempList or editedConvertedList
            // var formattedStation = temp.join("+") + "+bart+station";
            // convertedList.push(formattedStation);

            // //in fact, probably don't even need convertedList, since
            // //the DistanceMatrix query uses spaces instead of +. We'll
            // //just have to concat "Bart Station" onto the end of each index of availableStations.
            
            // convertedList.push(tempList[i].join("+"));
            // editedConvertedList.push(convertedList[i] + "+bart+station");