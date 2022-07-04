// =============== Variables ===============
var apiKey = 
var cityQuery = "City of London"
var latitude 
var longitude 
var weatherURL
var geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${cityQuery}&limit=5&appid=${apiKey}`

// =============== Functions ===============
function fetchLatLon () {
    fetch (geocodeURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (geocodeInfo) {
    latitude = geocodeInfo[0].lat;
    longitude = geocodeInfo[0].lon;
})
}

function fetchWeather () {
    weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`
    fetch (weatherURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (weatherInfo) {
    console.log(weatherURL);
    console.log (weatherInfo);
    console.log(weatherInfo.current.temp);
    console.log(weatherInfo.current.humidity);
    console.log(weatherInfo.current.wind_speed);
    console.log(weatherInfo.current.uvi);
    console.log(weatherInfo.current.weather[0].icon);
    console.log(weatherInfo.daily[0].temp.day);
    console.log(weatherInfo.daily[0].humidity);
    console.log(weatherInfo.daily[0].weather[0].icon);
    })
}