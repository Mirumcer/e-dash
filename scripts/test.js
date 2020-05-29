console.log("pageload")
const url = "https://api.breezometer.com/";
const airUrl = "air-quality/v2/"
const weatherUrl = "weather/v1/current-conditions?"
var key = "fcd4800cc1134c45a9cfb2e0f7d50e91"
var todayCard = document.getElementById("today");
pageload()

function pageload() {
    var lat = 0
    var long = 0
    lat, long = getlocation()
}

function getlocation() {
    if (navigator.geolocation) {
        position = navigator.geolocation.getCurrentPosition(updatePosition);

    } else {
        return;
    }
    return;
}

function updatePosition(position) {
    lat = position.coords.latitude
    long = position.coords.longitude
    console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude)

    getCurrentWeather()
    getforcast()
}

async function getforcast() {
    request = url + airUrl + "&lat=" + lat + "&lon=" + long + "&key=" + key + "&units=imperial"
}

function getCurrentWeather() {
    request = url + weatherUrl + "lat=" + lat + "&lon=" + long + "&key=" + key + "&units=imperial"
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayWeather(data))
}

function displayWeather(forcast) {
    var todayimg = document.getElementById("todayimg")
    if ([1, 2, 3, 4, 5, 6].includes(forcast.data.icon_code)) {
        console.log("sky is clear")
        if (forcast.data.is_day_time == true) {
            todayimg.src = "images/weather/clear_day.png"
        } else {
            todayimg.src = "images/weather/clear_night.png"
        }
    } else if ([7, 8, 9].includes(forcast.data.icon_code)) {
        console.log("sky is cloudy")
        if (forcast.data.is_day_time == true) {
            todayimg.src = "images/weather/partcloud_day.png"
        } else {
            todayimg.src = "images/weather/partcloud_night.png"
        }
    } else if ([10, 11, 12].includes(forcast.data.icon_code)) {
        console.log("Thunderstorms")
        todayimg.src = "images/weather/thunder.png"
    }
    console.log(forcast)
}