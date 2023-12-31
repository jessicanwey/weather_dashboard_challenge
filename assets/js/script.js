var searchFormEl = document.querySelector("#search-form");
var cityButtonsEl = document.querySelector("#city-buttons");
var cityInputEl = document.querySelector("#city-search");
var clearSearchButton = document.querySelector("#clear-history-button");
var noResultsEl = document.querySelector("#no-results");
var fiveDayEl = document.querySelector("#five-day-div");
var apiKey = "55e49e8735cbc3ae39cc6caf840ef04f";
var cityName;
var searchHistory;

var formSubmitHandler = function (event) {
  event.preventDefault();
  var cityName = cityInputEl.value.trim();

  //must submit a city name
  if (cityName !== null && cityName !== "") {
    getCurrentWeatherInformation(cityName);
      //add the city to the saved searches
    addToSavedSearches(cityName);
    cityInputEl.value = '';
  } else {
    window.alert("You must enter a value for city");
    return;
  }

};

//this handles the search when a previously seaarched city button is clicked
var buttonClickHandler = function (event) {
  cityName = event.currentTarget.innerText;
  getCurrentWeatherInformation(cityName);
};

//once the request has been made, this function will get the information and send to the function that populates the HTML
function getCurrentWeatherInformation(cityName) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&units=imperial&APPID=" +
    apiKey;

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        populateWeatherInfo(data);
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });
}

//this function populates the HTML for the current city and day then sends the longitude and latitude to the function that
//does the API call that gets the five day forecast information
function populateWeatherInfo(weatherInfo) {
  var city = weatherInfo.name;
  var temp = weatherInfo.main.temp;
  var wind = weatherInfo.wind.speed;
  var humidity = weatherInfo.main.humidity;
  var weatherArray = weatherInfo.weather;
  var icon = weatherArray[0].icon;
  var currentCityEl = document.querySelector("#current-city-header");
  var currentTempEl = document.querySelector("#current-temp");
  var currentHumidityEl = document.querySelector("#current-humidity");
  var currentWindEl = document.querySelector("#current-wind");
  var currentIconEl = document.querySelector("#current-icon");
  var currentWeekdayEl = document.querySelector("#current-weekday");
  var currentDate = dayjs().format("MM/DD/YYYY");
  var currentWeekday = dayjs().format("dddd");
  var currentLat = weatherInfo.coord.lat;
  var currentLong = weatherInfo.coord.lon;

  currentCityEl.textContent = city + " " + currentDate;
  currentTempEl.textContent = "Temp: " + temp + " °F";
  currentHumidityEl.textContent = "Humidity: " + humidity + " %";
  currentWindEl.textContent = "Wind: " + wind + " MPH";
  currentIconEl.setAttribute(
    "src",
    "https://openweathermap.org/img/wn/" + icon + "@2x.png"
  );
  currentWeekdayEl.textContent = currentWeekday;
  currentWeekdayEl.className = "text-2xl";
  getFiveDayForecast(currentLat, currentLong);
}

//this function will call the API with the latitude and longitude to get the five day forecast information
//it will then create the HTML
function getFiveDayForecast(latitude, longitude) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/forecast?lat=" +
    latitude +
    "&lon=" +
    longitude +
    "&exclude=currently,minutely,hourly,alerts&units=imperial&appid=" +
    apiKey;
  var futureDate;
  var futureTemp;
  var futureWind;
  var futureIcon;
  var futureHumidity;
  var fiveDayDivEl = document.querySelector("#five-day-div");

  //clear out the previous five day reults before populating new ones
  fiveDayDivEl.innerHTML = '';

  fetch(apiUrl).then(function (response) {
    if (response.ok) {
      response.json().then(function (data) {
        var daysList = data.list;
        for (var i = 0; daysList.length > 0; i+=8) {
          futureDate = data.list[i].dt_txt;
          futureWind = data.list[i].wind.speed;
          futureTemp = data.list[i].main.temp;
          futureIcon = data.list[i].weather[0].icon;
          futureHumidity = data.list[i].main.humidity;

          //this is where the HTML needs to be populated
          //do the add child thing instead of what you have going on
          var futureDayDivEl = document.createElement("div");
          var futureIconEl = document.createElement("img");
          //var resultsDivEl = document.querySelector('#results-div');
          fiveDayDivEl.appendChild(futureDayDivEl);
          futureDayDivEl.className = "bg-sky-500 p-3 text-white border-2 border-sky-300";
          futureDayDivEl.setAttribute("style", "white-space: pre-wrap;");
          futureDayDivEl.textContent =
            dayjs(futureDate).format("ddd - MMM D") +
            "\r\n" + //figure out line break
            futureTemp +
            "°\r\nWind: " +
            futureWind +
            " MPH\r\n" +
            "Humidity: " +
            futureHumidity;
          //futureDayDivEl.insertAdjacentElement("afterend", futureIconEl);
          futureDayDivEl.appendChild(futureIconEl);
          futureIconEl.setAttribute(
            "src",
            "https://openweathermap.org/img/wn/" + futureIcon + "@2x.png"
          );
        }
      });
    } else {
      alert("Error: " + response.statusText);
    }
  });

  fiveDayEl.className = "columns-5 gap-3 visible";
}

//when the page loads, the previously searched cities will be populated on
//buttons below the search field, if there aren't any saved searches, "No previous searches" will display
function getPreviousSearches() {
  var previousSearches = localStorage.getItem("previousSearches");
  searchHistory = JSON.parse(previousSearches);

  if (searchHistory !== null && searchHistory !== "") {
    var clearHistoryButton = document.createElement("button");
    cityButtonsEl.innerHTML = '';
    cityButtonsEl.appendChild(clearHistoryButton);
    clearHistoryButton.textContent = "CLEAR SEARCH HISTORY";
    clearHistoryButton.className =
      "p-2 mt-2 button w-full bg-sky-700 text-white rounded";
    clearHistoryButton.id = "clear-history-button";
    clearHistoryButton.addEventListener("click", clearSearchHistory);
    for (var i = 0; searchHistory.length > i; i++) {
      var cityButton = document.createElement("button");
      cityButtonsEl.appendChild(cityButton);
      cityName = searchHistory[i];
      cityButton.textContent = cityName.toUpperCase();
      cityButton.className = "mt-2 button w-full bg-sky-300 rounded";
      cityButton.addEventListener("click", buttonClickHandler);
    }
  } else {
    cityButtonsEl.setAttribute("style", "display:none");
    var noSearchesEl = document.createElement("div");
    noResultsEl.appendChild(noSearchesEl);
    noSearchesEl.innerText = "No previous searches";
  }
  return;
}

//when a city is searched for, it will be added to list of previous searched cities and saved in local storage
function addToSavedSearches(cityName) {
  //get previous searches from local storage
  var previousSearches = localStorage.getItem("previousSearches");
  searchHistory = JSON.parse(previousSearches);
  var currentCityName = cityName.toUpperCase();
  //if the seach history is not empty, verify the new city name is not already on the list of saved searches
  //if not, add it to the array of cities that have been previously searched
  //otherwise, make a new array and add the searched city to it
  if (searchHistory !== null) {
    for (var i = 0; searchHistory.length > i; i++) {
      var savedCityName = searchHistory[i].trim().toUpperCase();
      if (!searchHistory.includes(currentCityName)) {
        searchHistory.push(currentCityName);
        localStorage.setItem("previousSearches", JSON.stringify(searchHistory));
      }
    }
  } else {
    searchHistory = [];
    searchHistory.push(currentCityName);
    localStorage.setItem("previousSearches", JSON.stringify(searchHistory));
  }
  getPreviousSearches();
}

function clearSearchHistory() {
  localStorage.clear();
  getPreviousSearches();
}

searchFormEl.addEventListener("submit", formSubmitHandler);
getPreviousSearches();
