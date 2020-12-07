console.log("pageload")
const url = "https://api.openweathermap.org";
const airUrl = "air-quality/v2/"
const weatherUrl = "/data/2.5/weather?"
const hourlyForcast = "/data/2.5/forecast/hourly?"
const pollen = "pollen/v2/forecast/daily?"
const airForcast = "/data/2.5/air_pollution/forecast?"
const locationUrl = "https://maps.googleapis.com/maps/api/geocode/json?latlng="

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
    getforcast()
    getHourlyForcast()

    updateLocation()
}

function updateLocation() {
    var request = locationUrl + lat + "," + long + "&key=" + LocationKey
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayLocation(data))
}

function getforcast() {
    var request = url + airForcast + "lat=" + lat + "&lon=" + long + "&appid=" + key + "&units=" + unit
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayForcast(data))
}

function getCurrentWeather() {
    request = url + weatherUrl + "lat=" + lat + "&lon=" + long + "&appid=" + key + "&units=" + unit
    console.log(request)
    fetch(request)
        .then(response => response.json())
        .then(data => displayWeather(data))
}

function getHourlyForcast() {
    request = url + hourlyForcast + "lat=" + lat + "&lon=" + long + "&appid=" + key + "&units=" + unit
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

function populateGraph(forcast) {
    var temps = gettemps(forcast)
    var hourLabels = getHours(forcast)
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

function gettemps(forcast) {
    var temps = []
    for (hour of forcast.list) {
        temps.push(hour.main.temp)
    }
    console.log("temps:" + temps)
    return temps
}

function getHours(forcast) {
    var times = []
    for (hour of forcast.data) {
        hour = new Date(hour.datetime)
        hour = hour.toLocaleTimeString()
        times.push(hour)
    }
    console.log("times:" + times)
    return times
}

function displayWeather(forcast) {
    console.log(forcast)
    var todayimg = document.getElementById("todayimg")
    var id = forcast.weather[0].id
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
    temp = Math.round(forcast.main.temp)
    tempElem = document.getElementById("temperature")
    U = ""
    if (unit == "imperial") {
        U = "°F"
    } else {
        U = "°C"
    }
    tempText = temp + U
    tempElem.innerHTML = tempText

    description = forcast.weather[0].description
    descriptElem = document.getElementById("description")
    descriptElem.innerHTML = description

}

function displayLocation(location) {
    console.log(location)
    var locElem = document.getElementById("location")
    var string = location.results[8].formatted_address
    locElem.innerHTML = string
}

function displayPollen(forcast) {
    var max = 0
    var label = "None"

    console.log(forcast)

    if (forcast.data[0].types.grass.index.value > max) {
        max = forcast.data[0].types.grass.index.value
        label = forcast.data[0].types.grass.index.category
    }
    if (forcast.data[0].types.tree.index.value > max) {
        max = forcast.data[0].types.tree.index.value
        label = forcast.data[0].types.tree.index.category
    }
    if (forcast.data[0].types.weed.index.value > max) {
        max = forcast.data[0].types.weed.index.value
        label = forcast.data[0].types.weed.index.category
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

function updateAirCard(card, forcast) {
    var cardElem = document.getElementById("f" + card)
    var aqi = forcast.list[card * 4].main.aqi
    var img = document.getElementById("f" + card + "img")
    var title = document.getElementById("f" + card + "title")

    changeAirImg(aqi, img)

    var time = new Date(forcast.list[card * 4].dt * 1000)
    timetext = time.toLocaleTimeString()
    title.innerHTML = timetext

    //var cat = forcast.list[card * 4].main.aqi
    //catElem = document.getElementById("f" + card + "cat")
    //catElem.innerHTML = cat

    aqiElem = document.getElementById("f" + card + "aqi")
    aqiElem.innerHTML = aqi
}

function displayForcast(forcast) {
    console.log(forcast)

    updateAirCard(1, forcast)
    updateAirCard(2, forcast)
    updateAirCard(3, forcast)
    updateAirCard(4, forcast)

}