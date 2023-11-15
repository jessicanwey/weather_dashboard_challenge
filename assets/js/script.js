var searchFormEl = document.querySelector('#search-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city-search');
var clearSearchButton = document.querySelector('#clear-history-button');
var noResultsEl = document.querySelector('#no-results');
var apiKey = '55e49e8735cbc3ae39cc6caf840ef04f';
var cityName;
var searchHistory;

var formSubmitHandler = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
   
    //must submit a city name
    if(cityName !== null && cityName !== ""){
        getCurrentWeatherInformation(cityName);
    } else {
        window.alert("You must enter a value for city");
        return;
    }

    addToSavedSearches(cityName);
}

var buttonClickHandler = function (event){
    cityName = event.currentTarget.innerText;
    getCurrentWeatherInformation(cityName);
}

//once the request has been made, this funtion will get the information and build the HTML
function getCurrentWeatherInformation(cityName){
    var apiUrl = 'http://api.openweathermap.org/data/2.5/weather?q=' + cityName + '&units=imperial&APPID=' + apiKey;
    var weatherInfo;

    fetch(apiUrl)
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            populateWeatherInfo(data);
            console.log(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
}

function populateWeatherInfo(weatherInfo){
    var city = weatherInfo.name;
    var temp = weatherInfo.main.temp;
    var wind = weatherInfo.wind.speed;
    var humidity = weatherInfo.main.humidity;
    var weatherArray = weatherInfo.weather;
    var icon = weatherArray[0].icon;
    var currentCityEl = document.querySelector('#current-city');
    var currentTempEl = document.querySelector('#current-temp');
    var currentHumidityEl = document.querySelector('#current-humidity');
    var currentWindEl = document.querySelector('#current-wind');
    var currentIconEl = document.querySelector('#current-icon');
    var currentDateEl = document.querySelector('#current-date');
    var currentDate = dayjs().format('MM/DD/YYYY');
    var currentLat = weatherInfo.coord.lat;
    var currentLong = weatherInfo.coord.lon;

    console.log(city + " " + temp + " " + wind + " " + humidity + " " + currentDate + " " + currentLat + " " + currentLong);

    currentCityEl.textContent = city;
    currentTempEl.textContent = 'Temp: ' + temp + ' °F';
    currentHumidityEl.textContent = 'Humidity: ' + humidity + ' %';
    currentWindEl.textContent = 'Wind: ' + wind + ' MPH';
    currentIconEl.textContent = icon;
    currentIconEl.setAttribute('src', 'https://openweathermap.org/img/wn/' + icon + '@2x.png');
    currentDateEl.textContent = currentDate;

   // getFiveDayForecast(currentLat, currentLong);
}

function getFiveDayForecast(lattitude, longitude){
    //var apiUrl = 'https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&APPID=55e49e8735cbc3ae39cc6caf840ef04f';

    fetch('https://api.openweathermap.org/data/3.0/onecall?lat=33.44&lon=-94.04&exclude=hourly,daily&units=imperial&APPID=55e49e8735cbc3ae39cc6caf840ef04f')
    .then(function (response) {
        if (response.ok) {
          response.json().then(function (data) {
            console.log(data);
          });
        } else {
          alert('Error: ' + response.statusText);
        }
      })
}

//when the page loads, the previously searched cities will be populated on 
//buttons below the search field, if there aren't any saved searches, "No previous searches" will display
function getPreviousSearches(){
    var previousSearches = localStorage.getItem('previousSearches');
    searchHistory = JSON.parse(previousSearches);

    if(searchHistory !== null && searchHistory !== ""){
        var clearHistoryButton = document.createElement("button");
        cityButtonsEl.appendChild(clearHistoryButton);
        clearHistoryButton.textContent= "CLEAR SEARCH HISTORY";
        clearHistoryButton.className = 'p-2 mt-2 button w-full bg-sky-700 text-white rounded';
        clearHistoryButton.id = "clear-history-button";
        clearHistoryButton.addEventListener("click", clearSearchHistory);
            for(var i = 0; searchHistory.length > i; i++){
                var cityButton = document.createElement("button");
                cityButtonsEl.appendChild(cityButton);
                cityName = searchHistory[i];
                cityButton.textContent = cityName.toUpperCase();
                cityButton.className = 'mt-2 button w-full bg-sky-300 rounded';
                cityButton.addEventListener('click', buttonClickHandler);
            }
        } else {
            cityButtonsEl.setAttribute('style', "display:none");
            var noSearchesEl = document.createElement("div");
            noResultsEl.appendChild(noSearchesEl);
            noSearchesEl.innerText = "No previous searches";
        }
        return;
}

//when a city is searched for, it will be added to list of previous searched cities and saved in local storage
function addToSavedSearches(cityName){
    //get previous searches from local storage
    var previousSearches = localStorage.getItem("previousSearches");
    searchHistory = JSON.parse(previousSearches);
    var currentCityName = cityName.toUpperCase();
    //if the seach history is not empty, verify the new city name is not already on the list of saved searches
    //if not, add it to the array of cities that have been previously searched
    //otherwise, make a new array and add the searched city to it
    if(searchHistory !== null){
        for(var i = 0; searchHistory.length > i; i++){
            var savedCityName = searchHistory[i].trim().toUpperCase();
            if(!searchHistory.includes(currentCityName)){                
                searchHistory.push(currentCityName);
                localStorage.setItem("previousSearches", JSON.stringify(searchHistory));
            }
        }
    } else {
        searchHistory = [];
        searchHistory.push(currentCityName);
        localStorage.setItem("previousSearches", JSON.stringify(searchHistory));
    }

}

function clearSearchHistory(){
    localStorage.clear();
    getPreviousSearches();
}

searchFormEl.addEventListener('submit', formSubmitHandler);
getPreviousSearches();
