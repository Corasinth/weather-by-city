// =============== Variables ===============
var submitButton = document.getElementById("submit") 
var nameOfCity
var weatherURL
var geocodeURL
var keyList = []

var cityEl = document.getElementById("city")
var temperature = document.getElementById("temperature");
var humidity = document.getElementById("humidity")
var windSpeed = document.getElementById("windSpeed")
var uvIndex = document.getElementById("uvIndex")

// =============== Functions for Getting and Storing API Data ===============

//Fetches latitude and longitude from API, saves them to local storage along with the appropriate key names, and gives fetchWeather the coordinates
function fetchLatLon (city) {
    geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    fetch (geocodeURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (geocodeInfo) {
    var latitude = geocodeInfo[0].lat
    var longitude = geocodeInfo[0].lon 
   //This keeps undefineds from being part of the key names and prevents duplicates
    if (Boolean(geocodeInfo[0].state) === false || geocodeInfo[0].state === geocodeInfo[0].name) {
        nameOfCity = `${geocodeInfo[0].name}, ${geocodeInfo[0].country}`
    } else {
        nameOfCity = `${geocodeInfo[0].name}, ${geocodeInfo[0].state}, ${geocodeInfo[0].country}`
    }
    //Prevents duplicates from clogging search history
    if (keyList.includes(nameOfCity) === false) {
        //Keeps search history to 10 items or less
        if (keyList.length === 10) {
            localStorage.removeItem(keyList[0])
            keyList.shift()
            keyList.push (nameOfCity)
            localStorage.setItem ("keyList", JSON.stringify(keyList))
        } else {
        keyList.push (nameOfCity)
        localStorage.setItem ("keyList", JSON.stringify(keyList))
        }
    }
    localStorage.setItem (nameOfCity, JSON.stringify([latitude, longitude]))
    fetchWeather([latitude, longitude ])
})
}

//Gets weather information and sends it to be written to HTML
function fetchWeather (coordinateArray) {
    weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinateArray[0]}&lon=${coordinateArray[1]}&units=imperial&appid=${apiKey}`
    fetch (weatherURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (weatherInfo) {
    //Takes a variety of information from the returned data and writes it to appropriate places in the HTML
    console.log(weatherURL);
    console.log (weatherInfo);
    console.log(new Date(weatherInfo.current.dt*1000).toDateString());
    cityEl.textContent = `${nameOfCity} (${new Date(weatherInfo.current.dt*1000).toDateString()})`;
    var link = `https://openweathermap.org/img/wn/${weatherInfo.current.weather[0].icon}.png`
    document.getElementById("currentWeatherIcon").setAttribute("src", link);
    temperature.textContent = weatherInfo.current.temp;
    humidity.textContent = weatherInfo.current.humidity;
    windSpeed.textContent = weatherInfo.current.wind_speed;
    uvIndex.textContent = weatherInfo.current.uvi;
    //index 4-9 for month day format
    console.log(new Date(weatherInfo.daily[0].dt*1000).toDateString());
    console.log(weatherInfo.daily[0].temp.day);
    console.log(weatherInfo.daily[0].humidity);
    console.log(weatherInfo.daily[0].weather[0].icon);
    })
}

//Sets the current list of keys to the value saved in storage and writes it to HTML
function searchHistory () {
    var localKeyList = JSON.parse(localStorage.getItem("keyList"))
    if (Boolean(localKeyList) !== false) {
        keyList = localKeyList
    }
}

// =============== Functions for Writing API Data to HTML ===============




// =============== Event Listener ===============

//Handles searches and calls appropriate functions with appropriate values
submitButton.addEventListener("click", function (event) {
    event.preventDefault();
    var citySearchValue = document.getElementById("input").value;
    document.getElementById("input").value = "";
    fetchLatLon(citySearchValue);
})

// =============== Calling Functions ===============
searchHistory()