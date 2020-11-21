//Grabs Form Element
var formEl = $("form");
//current date
var today = moment().format("L");
//Stored API Key
var apiKey = "4a4e7e38b950e4866fbd81200ca3d5cb";
//runs pullData on submit of form
formEl.on("submit", pullData)

//stored cities variable
var stored =[];

//function to querry API on submit of form
function pullData(event){
    event.preventDefault();
    $(".infoContainer").show();
    $(".fiveDayCards").show();
    $(".noInfo").hide();
    $(".fiveDayCards").empty();
    //grabs city from Search box
    var city = $("#searchedCity").val().trim().toUpperCase();
    var state = $("#searchedState").val().trim().toUpperCase();

    if(!city || !state){
        alert("Please enter in a valid city and state")}
        else{
    var cityState = (city+","+state)
    //runs function to add city to local storage
    addCity();
    //Add City to most recent
    localStorage.setItem("mostRecentSearch", cityState);
    // api URL
    var queryURL =  "https://api.openweathermap.org/data/2.5/forecast?q="+cityState+"&appid=4a4e7e38b950e4866fbd81200ca3d5cb";
    // Ajax call to API
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    //log the response from the api
    console.log(response);
    //Fill in Data for Main Result Container

    //grab quick pic
   
    var quickPic = response.list[0].weather[0].icon
    console.log(quickPic);
    var quickPicURL = `https://openweathermap.org/img/wn/${quickPic}@2x.png`
    console.log(quickPicURL)
    $(".quickPic").attr("src",quickPicURL)
    

    // calculate the temperature (converted from Kelvin)
    var currentTemp = response.list[0].main.temp;
    var currentFarTemp = (((currentTemp-273.15)*1.8 +32).toFixed(2));
    console.log(currentFarTemp);
    $(".currentTemp").text(currentFarTemp+" °F");
    //get current wind speed
    var currentWindSpeed = response.list[0].wind.speed;
    $(".currentWindSpeed").text(currentWindSpeed+" MPH");
    console.log(currentWindSpeed);
    //get humidity
    var currentHumidity = response.list[0].main.humidity;
    $(".currentHumidity").text(currentHumidity+"%");
    //get UV Index ** must get lat and long
    var lat = response.city.coord.lat;
    console.log(lat);
    var lon = response.city.coord.lon;
    console.log(lon);

    // Fill In 5 Day Forecast
    //////////////////////////
    //Fill in Dates
    for(var i=0;i<5;i++){
        //loops through dates
        var dateCalc = moment().add(i+1,"d");
        var date = dateCalc.format("L");
        //create card div
        var card = $("<div>");
        card.addClass("card col-lg-2 col-md-4 col-sm-6 m-1 justify-content-center");
        //create UL
        var ul = $("<ul>");
        ul.addClass("list-group list-group-flush");
        //create date li element
        var cardDate = $("<li>");
        cardDate.text(date);
        cardDate.addClass("list-group-item cardDate");
        
        ///////////////////////////////////////////////////////
        //pull daily quickPic
        var dailyQuickPic = response.list[(i*8)+7].weather[0].icon ; 
        var dailyQuickPicURL = `https://openweathermap.org/img/wn/${dailyQuickPic}@2x.png`
        console.log(dailyQuickPicURL)
        var dailyPic = $("<li>")
        dailyPic.addClass("list-group-item")
        var dailyPicImg = $("<img>");
        dailyPicImg.attr("src",dailyQuickPicURL);
        dailyPic.append(dailyPicImg);
       
        //////////////////////////////////////////////////////

        //pull Temperature
        var dailyTemp = response.list[(i*8)+7].main.temp;
        var dailyFarTemp = (((dailyTemp-273.15)*1.8 +32).toFixed(2));
        var dailyTempEl = $("<li>");
        dailyTempEl.addClass("list-group-item");
        dailyTempEl.text("Temp: "+dailyFarTemp);

        //pull Humditiy

        var dailyHumid = response.list[(i*8)+7].main.humidity;
        var dailyHumidEl = $("<li>");
        dailyHumidEl.addClass("list-group-item");
        dailyHumidEl.text("Humdity: "+dailyHumid+"%");

         //append to Dom
         $(".fiveDayCards").append(card);
         card.append(ul);
         ul.append(cardDate,dailyPic,dailyTempEl,dailyHumidEl);
    }

    var indexURL = `https:////api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=4a4e7e38b950e4866fbd81200ca3d5cb`;
    $.ajax({
        url: indexURL,
        method: "GET"
        }).then(function(response) {
        //get the UV index
        console.log(response)
        var UVIndex = response.value;
        console.log(UVIndex)
        $(".currentUVIndex").text(UVIndex)

        if(UVIndex <=2){
            $(".currentUVIndex").addClass("lowIndex")
        }else if (UVIndex >2 && UVIndex <= 7) {
            $(".currentUVIndex").addClass("medIndex")
        }else{
            $(".currentUVIndex").addClass("highIndex")
        }
        });
    });
    
getStored();
location.reload();
    
    }
}

//Local Storage
//Render based on most recent search

var mostRecent = localStorage.getItem("mostRecentSearch");
console.log(mostRecent)


//On Load Checks For Recent Search
if(mostRecent){
    onOpenRender();
    $(".noInfo").hide();
}else{
    $(".infoContainer").hide();
    $(".fiveDayCards").hide();
}

function onOpenRender(){
    cityState = mostRecent

    localStorage.setItem("mostRecentSearch", cityState);
    // api URL
    var queryURL =  "https://api.openweathermap.org/data/2.5/forecast?q="+cityState+"&appid=4a4e7e38b950e4866fbd81200ca3d5cb";
    // Ajax call to API
    $.ajax({
    url: queryURL,
    method: "GET"
    }).then(function(response) {
    //log the response from the api
    console.log(response);
    //Fill in Data for Main Result Container
    //fill city and state
    $(".currentCity").text(`${cityState} ${today}`);

    //grab quick pic
   
    var quickPic = response.list[0].weather[0].icon
    console.log(quickPic);
    var quickPicURL = `https://openweathermap.org/img/wn/${quickPic}@2x.png`
    console.log(quickPicURL)
    $(".quickPic").attr("src",quickPicURL)
    

    // calculate the temperature (converted from Kelvin)
    var currentTemp = response.list[0].main.temp;
    var currentFarTemp = (((currentTemp-273.15)*1.8 +32).toFixed(2));
    console.log(currentFarTemp);
    $(".currentTemp").text(currentFarTemp+" °F");
    //get current wind speed
    var currentWindSpeed = response.list[0].wind.speed;
    $(".currentWindSpeed").text(currentWindSpeed+" MPH");
    console.log(currentWindSpeed);
    //get humidity
    var currentHumidity = response.list[0].main.humidity;
    $(".currentHumidity").text(currentHumidity+"%");
    //get UV Index ** must get lat and long
    var lat = response.city.coord.lat;
    console.log(lat);
    var lon = response.city.coord.lon;
    console.log(lon);

    // Fill In 5 Day Forecast
    //////////////////////////
    //Fill in Dates
    for(var i=0;i<5;i++){
        //loops through dates
        var dateCalc = moment().add(i+1,"d");
        var date = dateCalc.format("L");
        //create card div
        var card = $("<div>");
        card.addClass("card col-lg-2 col-md-4 col-sm-6 m-1 justify-content-center");
        //create UL
        var ul = $("<ul>");
        ul.addClass("list-group list-group-flush");
        //create date li element
        var cardDate = $("<li>");
        cardDate.text(date);
        cardDate.addClass("list-group-item cardDate");
        
        ///////////////////////////////////////////////////////
        //pull daily quickPic
        var dailyQuickPic = response.list[(i*8)+7].weather[0].icon ;
        var dailyQuickPicURL = `https://openweathermap.org/img/wn/${dailyQuickPic}@2x.png`
        console.log(dailyQuickPicURL)
        var dailyPic = $("<li>")
        dailyPic.addClass("list-group-item")
        var dailyPicImg = $("<img>");
        dailyPicImg.attr("src",dailyQuickPicURL);
        dailyPic.append(dailyPicImg);
       
        //////////////////////////////////////////////////////

        //pull Temperature
        var dailyTemp = response.list[(i*8)+7].main.temp;
        var dailyFarTemp = (((dailyTemp-273.15)*1.8 +32).toFixed(2));
        var dailyTempEl = $("<li>");
        dailyTempEl.addClass("list-group-item");
        dailyTempEl.text("Temp: "+dailyFarTemp);

        //pull Humditiy

        var dailyHumid = response.list[(i*8)+7].main.humidity;
        var dailyHumidEl = $("<li>");
        dailyHumidEl.addClass("list-group-item");
        dailyHumidEl.text("Humdity: "+dailyHumid+"%");

         //append to Dom
         $(".fiveDayCards").append(card);
         card.append(ul);
         ul.append(cardDate,dailyPic,dailyTempEl,dailyHumidEl);
    }

    var indexURL = `https:////api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=4a4e7e38b950e4866fbd81200ca3d5cb`;
    $.ajax({
        url: indexURL,
        method: "GET"
        }).then(function(response) {
        //get the UV index
        console.log(response)
        var UVIndex = response.value;
        console.log(UVIndex)
        $(".currentUVIndex").text(UVIndex)

        if(UVIndex <=2){
            $(".currentUVIndex").addClass("lowIndex")
        }else if (UVIndex >2 && UVIndex <= 7) {
            $(".currentUVIndex").addClass("medIndex")
        }else{
            $(".currentUVIndex").addClass("highIndex")
        }
        });
    });
}

//Stores up to 10 Searches and renders in most recent searches

var storedCities = JSON.parse(localStorage.getItem("storedCities"));
console.log(storedCities);

function renderStored(){

    if(storedCities){
        for(var i=0;i<storedCities.length;i++){
            var stored = [];
            stored.push(storedCities)
        }
    }else{
        storedCities = [];
    };
}

function getStored(){
    var storedCities = JSON.parse(localStorage.getItem("storedCities"));
        stored = [];
        $(".cityList").empty();
        console.log(storedCities)
        if(storedCities){
            if(storedCities.length<10){
                var loops = storedCities.length
            }else{
                var loops = 10;
            }
            for(var i = 0; i<loops;i++){
                console.log(storedCities[i]);
                stored.push(storedCities[i]);
                console.log(stored);

                //render to page
                var cityEl = $("<li>");
                cityEl.text(stored[i]);
                cityEl.addClass("list-group-item");
                cityEl.attr("data-city",stored[i]);
                $(".cityList").append(cityEl);
            }
        }
            
}
getStored();

//function to add new scores
function addCity(){

    getStored();

    var city = $("#searchedCity").val().trim().toUpperCase();
    var state = $("#searchedState").val().trim().toUpperCase();
    var cityState = (city+","+state)

    newCity = cityState

    stored.unshift(newCity)
    localStorage.setItem("storedCities", JSON.stringify(stored))
};

// Searches when clicking city in most recent
$("li").on("click", function(){
    var cityName = $(this).attr("data-city");
    console.log(cityName)
    if(cityName){
        cityState = cityName;
        var queryURL =  "https://api.openweathermap.org/data/2.5/forecast?q="+cityState+"&appid=4a4e7e38b950e4866fbd81200ca3d5cb";
        $(".fiveDayCards").empty();
        //Add City to most recent
        localStorage.setItem("mostRecentSearch", cityState);
        // Ajax call to API
        $.ajax({
        url: queryURL,
        method: "GET"
        }).then(function(response) {
        //log the response from the api
        console.log(response);
        //Fill in Data for Main Result Container
        //fill city and state
        $(".currentCity").text(`${cityState} ${today}`);

        //grab quick pic
    
        var quickPic = response.list[0].weather[0].icon
        console.log(quickPic);
        var quickPicURL = `https://openweathermap.org/img/wn/${quickPic}@2x.png`
        console.log(quickPicURL)
        $(".quickPic").attr("src",quickPicURL)
        

        // calculate the temperature (converted from Kelvin)
        var currentTemp = response.list[0].main.temp;
        var currentFarTemp = (((currentTemp-273.15)*1.8 +32).toFixed(2));
        console.log(currentFarTemp);
        $(".currentTemp").text(currentFarTemp+" °F");
        //get current wind speed
        var currentWindSpeed = response.list[0].wind.speed;
        $(".currentWindSpeed").text(currentWindSpeed+" MPH");
        console.log(currentWindSpeed);
        //get humidity
        var currentHumidity = response.list[0].main.humidity;
        $(".currentHumidity").text(currentHumidity+"%");
        //get UV Index ** must get lat and long
        var lat = response.city.coord.lat;
        console.log(lat);
        var lon = response.city.coord.lon;
        console.log(lon);

        // Fill In 5 Day Forecast
        //////////////////////////
        //Fill in Dates
        for(var i=0;i<5;i++){
            //loops through dates
            var dateCalc = moment().add(i+1,"d");
            var date = dateCalc.format("L");
            //create card div
            var card = $("<div>");
            card.addClass("card col-lg-2 col-md-4 col-sm-6 m-1 justify-content-center");
            //create UL
            var ul = $("<ul>");
            ul.addClass("list-group list-group-flush");
            //create date li element
            var cardDate = $("<li>");
            cardDate.text(date);
            cardDate.addClass("list-group-item cardDate");
            
            ///////////////////////////////////////////////////////
            //pull daily quickPic
            var dailyQuickPic = response.list[(i*8)+7].weather[0].icon ;
            var dailyQuickPicURL = `https://openweathermap.org/img/wn/${dailyQuickPic}@2x.png`
            console.log(dailyQuickPicURL)
            var dailyPic = $("<li>")
            dailyPic.addClass("list-group-item")
            var dailyPicImg = $("<img>");
            dailyPicImg.attr("src",dailyQuickPicURL);
            dailyPic.append(dailyPicImg);
        
            //////////////////////////////////////////////////////

            //pull Temperature
            var dailyTemp = response.list[(i*8)+7].main.temp;
            var dailyFarTemp = (((dailyTemp-273.15)*1.8 +32).toFixed(2));
            var dailyTempEl = $("<li>");
            dailyTempEl.addClass("list-group-item");
            dailyTempEl.text("Temp: "+dailyFarTemp);

            //pull Humditiy

            var dailyHumid = response.list[(i*8)+7].main.humidity;
            var dailyHumidEl = $("<li>");
            dailyHumidEl.addClass("list-group-item");
            dailyHumidEl.text("Humdity: "+dailyHumid+"%");

            //append to Dom
            $(".fiveDayCards").append(card);
            card.append(ul);
            ul.append(cardDate,dailyPic,dailyTempEl,dailyHumidEl);
        }

        var indexURL = `https:////api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=4a4e7e38b950e4866fbd81200ca3d5cb`;
        $.ajax({
            url: indexURL,
            method: "GET"
            }).then(function(response) {
            //get the UV index
            console.log(response)
            var UVIndex = response.value;
            console.log(UVIndex)
            $(".currentUVIndex").text(UVIndex)

            if(UVIndex <=2){
                $(".currentUVIndex").removeClass("lowIndex medIndex highIndex");
                $(".currentUVIndex").addClass("lowIndex");
            }else if (UVIndex >2 && UVIndex <= 7) {
                $(".currentUVIndex").removeClass("lowIndex medIndex highIndex");
                $(".currentUVIndex").addClass("medIndex");
            }else{
                $(".currentUVIndex").removeClass("lowIndex medIndex highIndex");
                $(".currentUVIndex").addClass("highIndex");
            }
            });
        });
    }
})
