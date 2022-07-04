// =============== Variables ===============
var apiKey = 
var cityQuery = "City of London"
var latitude
var longitude 

var geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityQuery}&limit=5&appid=${apiKey}`
var weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&appid=${apiKey}`


// =============== Functions ===============
function fetchLatLon () {
    fetch (geocodeURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (geocodeInfo) {
    console.log (geocodeInfo)
    console.log(geocodeInfo[0].lat);
    console.log(geocodeInfo[0].lon);
    })
}

function fetchWeather () {
    fetch (requestURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (weatherInfo) {
    
    console.log (weatherInfo)
    })
}