function showLoading() {
    document.getElementById("cityname").innerHTML = "Loading...";
    document.getElementsByTagName("body")[0].setAttribute("style", "background-color: grey");
}

function dismissLoading() {
    document.getElementsByTagName("body")[0].setAttribute("style", "background-color: white");
}

function setCityName(name) {
    document.getElementById("cityname").innerHTML = name;
}

function convertToCelsius(temp) {
    return temp - 273.15;
}

function makeDayDiv(date, maxTemp, avgHumidity) {
    const template = "<div><h3>" + date + "</h3>" + "<h5>Avg Humidity: " + avgHumidity.toFixed(2) + "</h5>" + "<h5>Max Temperature: " + maxTemp.toFixed(2) + "</h5></div><hr />";

    return template;
}

function renderDateMap(dayMap) {
    const dataElement = document.getElementById("weatherdata");
    dayMap.forEach(function (day, date, dayMap) {
        const maxTemp = day.maxTemp;
        const avgHumidity = day.totalHumidity / day.noOfRecords;

        const data = document.createElement("div");
        data.innerHTML = makeDayDiv(date, maxTemp, avgHumidity);
        dataElement.appendChild(data);
    });
}

function parseData(data) {
    let dayMap = new Map();
    const records = data.list;

    records.forEach(r => {
        // parse the date in a readable format
        const date = new Date(r.dt_txt).toDateString();

        // parse the max temperature and humidities to make a day object
        const recordMaxTemp = convertToCelsius(r.main.temp_max);
        const recordHumidity = r.main.humidity;

        // only the essential data
        let day = {
            date,
            noOfRecords: 1,
            maxTemp: recordMaxTemp,
            totalHumidity: recordHumidity
        }

        // update the date
        if (dayMap.has(date)) {
            let currentDay = dayMap.get(date);
            day.noOfRecords = currentDay.noOfRecords + 1;
            day.maxTemp = Math.max(currentDay.maxTemp, recordMaxTemp);
            day.totalHumidity = currentDay.totalHumidity + recordHumidity;
        }
        dayMap.set(date, day);
    });

    renderDateMap(dayMap);
}

function parse(data) {
    // json object logged for inspection
    console.log(data);
    const name = data.city.name;
    setCityName(name);
    parseData(data);
}

function run() {
    showLoading();

    // using cors-anywhere applet as a workaround found on a forum in 'freeCodeCamp' to use a CORS proxy and prevent cors blocking that i faced without it.
    const corsAnywhereHost = "https://cors-anywhere.herokuapp.com/";

    const owmSampleLink = "https://samples.openweathermap.org/data/2.5/forecast?id=524901&appid=b6907d289e10d714a6e88b30761fae22";

    $.getJSON(corsAnywhereHost + owmSampleLink, function (data) {
        dismissLoading();
        parse(data);
    });
}

run();