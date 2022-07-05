// =============== Variables ===============
var submitButton = document.getElementById("submit")
var apiKey = "c568cd8c4c4e9b074feb1103b4c9a187"
var weatherURL
var geocodeURL

var keyList = []
// =============== Functions for Getting Data ===============
function fetchLatLon (city) {
    geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    fetch (geocodeURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (geocodeInfo) {
    var location = `${geocodeInfo[0].name}, ${geocodeInfo[0].state}, ${geocodeInfo[0].country}`
    var latitude = geocodeInfo[0].lat
    var longitude = geocodeInfo[0].lon    
    if (keyList.includes(location) === false) {
        if (keyList.length === 10) {
            localStorage.removeItem(keyList[0])
            keyList.shift()
            keyList.push (location)
            localStorage.setItem ("keyList", JSON.stringify(keyList))
        } else {
        keyList.push (location)
        localStorage.setItem ("keyList", JSON.stringify(keyList))
        }
    }
    localStorage.setItem (location, JSON.stringify([latitude, longitude]))
    fetchWeather([latitude, longitude ])
})
.then (function check () {
 
}
)}

async function fetchWeather (coordinateArray) {
    weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinateArray[0]}&lon=${coordinateArray[1]}&units=imperial&appid=${apiKey}`
    fetch (weatherURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (weatherInfo) {
    console.log(weatherURL);
    console.log (weatherInfo);
    console.log(new Date(weatherInfo.current.dt*1000).toDateString());
    console.log(weatherInfo.current.temp);
    console.log(weatherInfo.current.humidity);
    console.log(weatherInfo.current.wind_speed);
    console.log(weatherInfo.current.uvi);
    console.log(weatherInfo.current.weather[0].icon);
    //index 4-9 for month day format
    console.log(new Date(weatherInfo.daily[0].dt*1000).toDateString());
    console.log(weatherInfo.daily[0].temp.day);
    console.log(weatherInfo.daily[0].humidity);
    console.log(weatherInfo.daily[0].weather[0].icon);
    })
}

// =============== Functions for Storing and Writing API Information ===============



// =============== Event Listener ===============
submitButton.addEventListener("click", async function (event) {
    event.preventDefault();
    var citySearchValue = document.getElementById("input").value;
    console.log("this is" + citySearchValue);
    fetchLatLon(citySearchValue);
})