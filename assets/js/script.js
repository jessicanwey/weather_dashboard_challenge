var searchFormEl = document.querySelector('#search-form');
var cityButtonsEl = document.querySelector('#city-buttons');
var cityInputEl = document.querySelector('#city-search');
var clearSearchButton = document.querySelector('#clear-history-button');
var apiKey = '55e49e8735cbc3ae39cc6caf840ef04f';
var cityName;
var searchHistory;

var formSubmitHandler = function (event) {
    event.preventDefault();
    var cityName = cityInputEl.value.trim();
   
    //must submit a city name
    if(cityName !== null && cityName !== ""){
        var apiUrl = 'https://api.openweathermap.org/data/2.5/forecast?q={' + cityName + '}&appid={' + apiKey + '}';

        fetch(apiUrl)
            .then(function(response){
                if(response.ok){
                response.json.then(function(data){
                    console.log(data.wind.speed);
                })
                } else {
                    alert('Error: ' + response.statusText);
                }
            });
    } else {
        window.alert("You must enter a value for city");
        return;
    }

    addToSavedSearches(cityName);
}

var buttonClickHandler = function (event){
    getCurrentWeatherInformation();
}

//once the request has been made, this funtion will get the information and build the HTML
function getCurrentWeatherInformation(cityName){

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
            }
        } else {
            var noSearchesEl = document.createElement("div");
            cityButtonsEl.appendChild(noSearchesEl);
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
cityButtonsEl.addEventListener('click', buttonClickHandler);
getPreviousSearches();
