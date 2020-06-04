console.log("pageload")
const url = "https://api.breezometer.com/";
const airUrl = "air-quality/v2/"
const weatherUrl = "weather/v1/current-conditions?"
const airForcast = "forecast/hourly?"
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

function getforcast() {
    var request = url + airUrl + airForcast + "lat=" + lat + "&lon=" + long + "&key=" + key + "&hours=" + "17" + "&units=imperial"
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayForcast(data))
}

function getCurrentWeather() {
    request = url + weatherUrl + "lat=" + lat + "&lon=" + long + "&key=" + key + "&units=imperial"
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayWeather(data))
}

function shouldOpenWindow()

function displayWeather(forcast) {
    console.log(forcast)
    var todayimg = document.getElementById("todayimg")
    if ([1, 2, 3, 4, 5, 6, 13, 14, 15].includes(forcast.data.icon_code)) {
        console.log("sky is clear")
        if (forcast.data.is_day_time == true) {
            todayimg.src = "images/weather/clear_day.png"
        } else {
            todayimg.src = "images/weather/clear_night.png"
        }
    } else if ([7, 8, 9, 16, 17, 18].includes(forcast.data.icon_code)) {
        console.log("sky is partly cloudy")
        if (forcast.data.is_day_time == true) {
            todayimg.src = "images/weather/partcloud_day.png"
        } else {
            todayimg.src = "images/weather/partcloud_night.png"
        }
    } else if ([10, 11, 12, 27, 28, 30].includes(forcast.data.icon_code)) {
        console.log("Thunderstorms")
        todayimg.src = "images/weather/thunder.png"
    } else if ([19, 20, 21, 22].includes(forcast.data.icon_code)) {
        console.log("sky is cloudy")
        todayimg.src = "images/weather/cloudy.png"
    } else if ([23, 25, 31, 33, 35].includes(forcast.data.icon_code)) {
        console.log("rainy")
        todayimg.src = "images/weather/rainy.png"
    } else if ([24, 26, 29, 32, 34].includes(forcast.data.icon_code)) {
        console.log("snowy")
        todayimg.src = "images/weather/snow.png"
    }
    temp = Math.round(forcast.data.temperature.value)
    tempElem = document.getElementById("temperature")
    tempText = document.createTextNode(temp + "°F")
    tempElem.appendChild(tempText)

    description = forcast.data.weather_text
    descriptElem = document.getElementById("description")
    descriptText = document.createTextNode(description)
    descriptElem.appendChild(descriptText)

}

function changeAirImg(aqi, container) {
    if (aqi > 60) {
        container.src = "images/Air/AirGreen.png"
    } else if (aqi <= 60 && aqi > 40) {
        container.src = "images/Air/AirOrange.png"
    } else if (aqi <= 40 && aqi > 20) {
        container.src = "images/Air/AirRed.png"
    } else {
        container.src = "images/Air/AirWarning.png"
    }
}

function updateAirCard(card, forcast) {
    var cardElem = document.getElementById("f" + card)
    var aqi = forcast.data[card * 4].indexes.baqi.aqi_display
    var img = document.getElementById("f" + card + "img")
    var title = document.getElementById("f" + card + "title")

    changeAirImg(aqi, img)

    var time = new Date(forcast.data[card * 4].datetime)
    timetext = document.createTextNode(time.toLocaleTimeString())
    title.appendChild(timetext)

    var cat = document.createTextNode(forcast.data[card * 4].indexes.baqi.category)
    catElem = document.getElementById("f" + card + "cat")
    catElem.appendChild(cat)

    var aqiText = document.createTextNode(aqi)
    aqiElem = document.getElementById("f" + card + "aqi")
    aqiElem.appendChild(aqiText)
}

function displayForcast(forcast) {
    console.log(forcast)

    updateAirCard(1, forcast)
    updateAirCard(2, forcast)
    updateAirCard(3, forcast)
    updateAirCard(4, forcast)

}