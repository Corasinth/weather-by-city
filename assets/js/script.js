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
var ulEl = document.querySelector("ul")
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
        //Saves search to a list of keys in order to make later retrieval for search history easier
        keyList.push (nameOfCity)
        localStorage.setItem ("keyList", JSON.stringify(keyList))
        searchHistory()
        }
    }
    localStorage.setItem (nameOfCity, JSON.stringify([latitude, longitude]))
    fetchWeather([latitude, longitude ])
})
}

//Gets weather information and writes it to HTML
function fetchWeather (coordinateArray) {
    weatherURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinateArray[0]}&lon=${coordinateArray[1]}&units=imperial&appid=${apiKey}`
    fetch (weatherURL)
    .then(function(response) {
    return response.json();
    })
    .then (function (weatherInfo) {
    //Takes a variety of information from the returned data and writes it to appropriate places in the HTML
    cityEl.textContent = `${nameOfCity} (${new Date(weatherInfo.current.dt*1000).toDateString()})`;
    document.getElementById("currentWeatherIcon").setAttribute("src", `https://openweathermap.org/img/wn/${weatherInfo.current.weather[0].icon}.png`);
    temperature.textContent = weatherInfo.current.temp;
    humidity.textContent = weatherInfo.current.humidity;
    windSpeed.textContent = weatherInfo.current.wind_speed;
    uvIndex.textContent = weatherInfo.current.uvi;
    //This section programmatically determines the background color of the UV index based on its value
    var num1;
    var num2;
    if (weatherInfo.current.uvi <= 5) {
        num1 = Math.round(51*weatherInfo.current.uvi);
        num2 = Math.round((21*weatherInfo.current.uvi)+150);
    } else {
        num1 = 255;
        num2 =  Math.round(510-(51*weatherInfo.current.uvi));
    };
    uvIndex.setAttribute("style", `background-color: rgb(${num1}, ${num2}, 0);`);
    //Fills out each forecast card
    for (var i = 0; i < 5; i++) {
        var date = new Date(weatherInfo.daily[i].dt*1000).toDateString();
        document.getElementById(`forecast${i}`).textContent = `${date[4]}${date[5]}${date[6]} ${date[8]}${date[9]}`;
        document.getElementById(`temp${i}`).textContent = `${weatherInfo.daily[i].temp.day} °F`;
        document.getElementById(`humid${i}`).textContent = `${weatherInfo.daily[i].humidity}%`;
        document.getElementById(`icon${i}`).setAttribute ("src", `https://openweathermap.org/img/wn/${weatherInfo.daily[i].weather[0].icon}.png`)
    }
    })
}

//Sets the current list of keys to the value saved in storage and writes it to HTML
function searchHistory () {
    var localStorageKeyList = JSON.parse(localStorage.getItem("keyList"))
    if (Boolean(localStorageKeyList) !== false) {
        keyList = localStorageKeyList;
        for (var i = 0; i < keyList.length ; i++) {
            var liEl = document.createElement("li", `id=search${i} class="bg-primary m-1"`);
            liEl.textContent = keyList[i];
            ulEl.appendChild(liEl);
        }
    }
}

// =============== Event Listener ===============
//Handles searches and calls appropriate functions with appropriate values
submitButton.addEventListener("click", function (e) {
    e.preventDefault();
    var citySearchValue = document.getElementById("input").value;
    document.getElementById("input").value = "";
    fetchLatLon(citySearchValue);
})

// =============== Calling Functions ===============
searchHistory()
fetchLatLon("San Francisco")