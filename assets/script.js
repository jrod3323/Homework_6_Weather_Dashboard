//Grabs Form Element
var formEl = $("form");
//current date
var today = moment().format("L");
//Stored API Key
var apiKey = "4a4e7e38b950e4866fbd81200ca3d5cb";
//runs pullData on submit of form
formEl.on("submit", pullData)

//function to querry API on submit of form
function pullData(event){
    event.preventDefault();
    //grabs city from Search box
    var city = $("#searchedCity").val().trim();
    var state = $("#searchedState").val().trim();
    var cityState = (city+","+state)
    // api URL
    var queryURL =  "http://api.openweathermap.org/data/2.5/forecast?q="+cityState+"&appid=4a4e7e38b950e4866fbd81200ca3d5cb";
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
    var quickPicURL = `http://openweathermap.org/img/wn/${quickPic}@2x.png`
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
    var currentHumidity = response.list[0].main.currentHumidity;
    $(".currentHumidity").text(currentHumidity+"%");
    //get UV Index ** must get lat and long
    var lat = response.city.coord.lat;
    console.log(lat);
    var lon = response.city.coord.lon;
    console.log(lon);

    var indexURL = `http:////api.openweathermap.org/data/2.5/uvi?lat=${lat}&lon=${lon}&appid=4a4e7e38b950e4866fbd81200ca3d5cb`;
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
    // Fill In 5 Day Forecast
    //////////////////////////
    //Fill in Dates
    for(var i=0;i<5;i++){
        //loops through dates
        var dateCalc = moment().add(i,"d");
        var date = dateCalc.format("L");
        //create card div
        var card = $("<div>");
        card.addClass("card col-2");
        //create UL
        var ul = $("<ul>");
        ul.addClass("list-group list-group-flush");
        //create date li element
        var cardDate = $("<li>");
        cardDate.text(date);
        cardDate.addClass("list-group-item cardDate");
        
        ///////////////////////////////////////////////////////
        //pull daily quickPic
        var dailyQuickPic = response.list[(i*8)].weather.icon ;
        var dailyQuickPicURL = `http://openweathermap.org/img/wn/${dailyQuickPic}@2x.png`
        console.log(dailyQuickPicURL)
        var dailyPic = $("<li>")
        var dailyPicImg = $("<img>");
        dailyPicImg.attr("src",dailyQuickPicURL);
        dailyPic.append(dailyPicImg);
        //append to Dom
        $(".fiveDayCards").append(card);
        card.append(ul);
        ul.append(cardDate,dailyPic);
        //////////////////////////////////////////////////////
    }

}


