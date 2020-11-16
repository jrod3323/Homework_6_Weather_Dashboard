//Grabs Form Element
var formEl = $("form");
//Stored API Key
var apiKey = "4a4e7e38b950e4866fbd81200ca3d5cb";
//runs pullData on submit of form
formEl.on("submit", pullData)

//function to querry API on submit of form
function pullData(event){
    event.preventDefault();
    //grabs city from Search box
    var city = $("#searchedCity").val();
    // api URL
    var queryURL =  "http://api.openweathermap.org/data/2.5/forecast?q="+city+"&appid=4a4e7e38b950e4866fbd81200ca3d5cb";
    // Ajax call to API
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    //log the response from the api
    console.log(response);
    //grab city
    var cityName = response.city.name;
    console.log(cityName);
    // calculate the temperature (converted from Kelvin)
    var currentTemp = response.list[0].main.temp;
    var currentFarTemp = ((currentTemp-273.15)*1.8 +32).toFixed(2);
    console.log(currentFarTemp)
    });
}
