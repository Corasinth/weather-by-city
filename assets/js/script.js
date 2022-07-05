// =============== Variables ===============
var submitButton = document.getElementById("submit")
var apiKey
var weatherURL
var geocodeURL
var keyList = []
// =============== Functions for Getting and Storing API Data ===============

//Fetches latitude and longitude from API, saves them to local storage along with the appropriate key names, and gives fetchWeather the coordinates
function fetchLatLon (city) {
    geocodeURL = `http://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=5&appid=${apiKey}`
    fetch (geocodeURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (geocodeInfo) {
    //Although location is defined just 5 lines lower, for some reason if it isn't defined 
    var latitude = geocodeInfo[0].lat
    var longitude = geocodeInfo[0].lon 
    //Although location is defined in the if statements below, if it is not defined here then the key list includes a strange object for no apparent reason. If the var location isn't created here, then the HTML file gets saved to local storage, and the tab crashes until the item is cleared. While this can be solved by simply not including the if statements below and letting the key list read out with "undefined" strings, The current implementation does work without any bugs I've been able to find. 
    var location = `${geocodeInfo[0].name}, ${geocodeInfo[0].state}, ${geocodeInfo[0].country}`   
   //This keeps undefineds from being part of the key names
    if (Boolean(geocodeInfo[0].state) === false) {
        location = `${geocodeInfo[0].name}, ${geocodeInfo[0].country}`
    } else {
        location = `${geocodeInfo[0].name}, ${geocodeInfo[0].state}, ${geocodeInfo[0].country}`
    }
    //Prevents duplicates from clogging search history
    if (keyList.includes(location) === false) {
        //Keeps search history to 10 items or less
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
}

//Gets weather information and sends it to be written to HTML
function fetchWeather (coordinateArray) {
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
    console.log("this is" + citySearchValue);
    fetchLatLon(citySearchValue);
})

// =============== Calling Functions ===============
searchHistory()