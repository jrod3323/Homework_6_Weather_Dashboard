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
    var queryURL =  "http://api.openweathermap.org/data/2.5/weather?q="+city+"&APPID=4a4e7e38b950e4866fbd81200ca3d5cb";
    // Ajax call to API
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    //log the response from the api
    console.log(response);
    // calculate the temperature (converted from Kelvin)
    var temp = response.main.temp
    var farTemp = (temp-273.15)*1.8 +32
    console.log(farTemp)
    });
}
