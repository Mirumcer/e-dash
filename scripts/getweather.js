console.log("loadpage")
const url = "https://api.breezometer.com/air-quality/v2/forecast/hourly?";
//format url?lat=<>&lon=<>&key=<>&hours=<>&features=<>

console.log("loadpage")
pageload()


function pageload() {
    var todayCard = document.getElementById("today")
    var lat = 0
    var long = 0
    lat, long = getlocation()
}


function getlocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(showPosition);
    } else {
        return;
    }
    return;
}

function showPosition(position) {
    todayCard.innerHTML = "Latitude: " + position.coords.latitude +
        "<br>Longitude: " + position.coords.longitude;

    console.log("Latitude: " + position.coords.latitude + "<br>Longitude: " + position.coords.longitude)
}