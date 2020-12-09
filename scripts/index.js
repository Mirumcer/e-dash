console.log("pageload")
const url = "https://api.openweathermap.org";
const airUrl = "air-quality/v2/"
const weatherUrl = "/data/2.5/weather?"
const hourlyForecast = "/data/2.5/onecall?"
const pollen = "pollen/v2/forecast/daily?"
const airforecast = "/data/2.5/air_pollution/forecast?"
const locationUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="

//I know it's pretty bad to have these here, but the keys are locked down
//so it's not so bad. if I change away from github pages ill move these
//to be environment variables.
const key = "5f101ad9da12c589bde8006e44cc09a5"
const LocationKey = "AIzaSyDphmMJAriYmjChCZc1-fGhKzLriu8NbSc"

var unit = "imperial"

var todayCard = document.getElementById("today");
pageload()

document.getElementById('unitImperial').addEventListener('change', function() {
    console.log("Setting units to imperial.")
    unit = "imperial"
    updatePosition()
})
document.getElementById('unitMetric').addEventListener('change', function() {
    console.log("Setting units to metric.")
    unit = "metric"
    updatePosition()

})

function pageload() {
    var lat = 0
    var long = 0
    lat, long = getlocation()

}

function getlocation() {
    if (navigator.geolocation) {
        position = navigator.geolocation.getCurrentPosition(updatePositionRaw);

    } else {
        return;
    }
    return;
}

function updatePositionRaw(position) {
    lat = position.coords.latitude
    long = position.coords.longitude
    console.log("Latitude: " + position.coords.latitude + "Longitude: " + position.coords.longitude)
    updatePosition()
}

function updatePosition() {

    getPollen()
    getCurrentWeather()
    getforecast()
    getHourlyforecast()

    updateLocation()
}

function updateLocation() {
    var request = locationUrl + lat + "," + long + "&key=" + LocationKey
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayLocation(data))
}

function getforecast() {
    var request = url + airforecast + "lat=" + lat + "&lon=" + long + "&appid=" + key + "&units=" + unit
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayforecast(data))
}

function getCurrentWeather() {
    request = url + weatherUrl + "lat=" + lat + "&lon=" + long + "&appid=" + key + "&units=" + unit
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayWeather(data))
}

function getHourlyforecast() {
    request = url + hourlyForecast + "lat=" + lat + "&lon=" + long + "&appid=" + key + "&units=" + unit + "&exclude=curent,minutely,daily,alerts"
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => populateGraph(data))
}

function getPollen() {
    request = url + pollen + "lat=" + lat + "&lon=" + long + "&key=" + key + "&days=" + 1
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayPollen(data))
}

function populateGraph(forecast) {
    console.log("forecast:", forecast)
    var temps = gettemps(forecast)
    var hourLabels = getHours(forecast)
    var chartElem = document.getElementById('graph')
    var ctx = chartElem.getContext('2d')
    var myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: hourLabels,
            datasets: [{
                label: "Temp",
                borderColor: "#00916e",
                backgroundColor: "	rgba(0, 145, 110, 0.2)",
                data: temps,
                fill: true
            }]
        },
        options: {
            maintainAspectRatio: false,

            scales: {
                yAxes: [{
                    gridLines: {
                        drawBorder: false,
                        display: false,
                    },
                    ticks: {
                        beginAtZero: true
                    }
                }],
                xAxes: [{
                    gridLines: {
                        display: false,
                    },
                }],

            },
            legend: {
                display: false,
            },


        },
    });
}

function gettemps(forecast) {
    var temps = []
    for (hour of forecast.hourly) {
        temps.push(hour.temp)
    }
    console.log("temps:" + temps)
    return temps
}

function getHours(forecast) {
    var times = []
    for (hour of forecast.hourly) {
        hour = new Date(hour.dt * 1000)
        hour = hour.toLocaleTimeString()
        times.push(hour)
    }
    console.log("times:" + times)
    return times
}

function displayWeather(forecast) {
    console.log(forecast)
    var todayimg = document.getElementById("todayimg")
    var id = forecast.weather[0].id
    console.log("icon_id", id)
    if (id == 800) {
        console.log("sky is clear")
        todayimg.src = "images/weather/clear_day.png"
    } else if (id == 801) {
        console.log("sky is partly cloudy")
        todayimg.src = "images/weather/partcloud_day.png"
    } else if (id >= 200 && id < 300) {
        console.log("Thunderstorms")
        todayimg.src = "images/weather/thunder.png"
    } else if (id > 801 && id < 900) {
        console.log("sky is cloudy")
        todayimg.src = "images/weather/cloudy.png"
    } else if (id >= 300 && id < 600) {
        console.log("rainy")
        todayimg.src = "images/weather/rainy.png"
    } else if (id >= 600 && id < 700) {
        console.log("snowy")
        todayimg.src = "images/weather/snow.png"
    }
    temp = Math.round(forecast.main.temp)
    tempElem = document.getElementById("temperature")
    U = ""
    if (unit == "imperial") {
        U = "°F"
    } else {
        U = "°C"
    }
    tempText = temp + U
    tempElem.innerHTML = tempText

    description = forecast.weather[0].description
    descriptElem = document.getElementById("description")
    descriptElem.innerHTML = description

}

function displayLocation(location) {
    console.log(location)
    var locElem = document.getElementById("location")
    var string = location.results[8].formatted_address
    locElem.innerHTML = string
}

function displayPollen(forecast) {
    var max = 0
    var label = "None"

    console.log(forecast)

    if (forecast.data[0].types.grass.index.value > max) {
        max = forecast.data[0].types.grass.index.value
        label = forecast.data[0].types.grass.index.category
    }
    if (forecast.data[0].types.tree.index.value > max) {
        max = forecast.data[0].types.tree.index.value
        label = forecast.data[0].types.tree.index.category
    }
    if (forecast.data[0].types.weed.index.value > max) {
        max = forecast.data[0].types.weed.index.value
        label = forecast.data[0].types.weed.index.category
    }
    const colors = { null: "#00916e", 0: "#00916e", 1: "#00916e", 2: "#00916e", 3: "#879100", 4: "#916300", 5: "#910500" }

    var windowElem = document.getElementById("window")
    var textLabel = document.getElementById("pollenLabel")
    textLabel.innerHTML = label
    textLabel.style.color = colors[max]
    windowElem.innerHTML = "Pollen Count is "
    windowElem.append(textLabel)
}

function changeAirImg(aqi, container) {
    if (aqi == 1) {
        container.src = "images/Air/AirGreen.png"
    } else if (aqi == 2 || aqi == 3) {
        container.src = "images/Air/AirOrange.png"
    } else if (aqi == 4) {
        container.src = "images/Air/AirRed.png"
    } else {
        container.src = "images/Air/AirWarning.png"
    }
}

function updateAirCard(card, forecast) {
    var cardElem = document.getElementById("f" + card)
    var aqi = forecast.list[card * 2].main.aqi
    var img = document.getElementById("f" + card + "img")
    var title = document.getElementById("f" + card + "title")

    changeAirImg(aqi, img)

    var time = new Date(forecast.list[card * 2].dt * 1000)
    timetext = time.toLocaleTimeString()
    console.log("forecast index", card * 2, "AQI Time:", timetext)
    title.innerHTML = timetext

    //var cat = forecast.list[card * 4].main.aqi
    //catElem = document.getElementById("f" + card + "cat")
    //catElem.innerHTML = cat

    aqiElem = document.getElementById("f" + card + "aqi")
    aqiElem.innerHTML = aqi
}

function displayforecast(forecast) {
    console.log(forecast)

    updateAirCard(1, forecast)
    updateAirCard(2, forecast)
    updateAirCard(3, forecast)
    updateAirCard(4, forecast)

}