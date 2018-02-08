// ===================================================
// ================ Execution Starts =================
// ===================================================

updatePreferenceUI();

//while clientLocation === undefined
//check for it to not be undefined

var intervalId;
intervalId = setInterval(checkClientLocated, 500);

function checkClientLocated() {
	if(clientLocation != undefined) {
		clearInterval(intervalId);
		enterRefreshLoop();
		setInterval(enterRefreshLoop, 20000);
	}
}

function enterRefreshLoop() {
	updateAvailableStations();
}