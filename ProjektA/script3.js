let apiKey = "3ef6cb33f000407b1e7c61ac7686290d";

function fetchWeather(searchCity)
{
    fetch("https://api.openweathermap.org/data/2.5/weather?q=" + searchCity + "&units=metric&appid=" + apiKey)
    .then((response) => {
        if(!response.ok) 
        {
            alert("Nenašlo se počasí.")
            throw new Error("Nenašlo se počasí.");
        }
        fetchGraphWeather(searchCity);
        return response.json();
    }).then(response => {
        displayWeather(response);
    })
}

function fetchGraphWeather(searchCity)
{
    fetch("https://api.openweathermap.org/data/2.5/forecast?q=" + searchCity + "&units=metric&appid=" + apiKey)
    .then((response) => {
        if(!response.ok) 
        {
            alert("Nenašlo se počasí.")
            throw new Error("Nenašlo se počasí.");
        }
        return response.json();
    }).then(response => {
        drawGraph(response);
    })
}

function displayWeather(data)
{
    const { name } = data;
    const { icon, description } = data.weather[0];
    const { temp, humidity } = data.main;
    const { speed } = data.wind;
    document.querySelector(".city").innerText = name;
    document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
    document.querySelector(".description").innerText = description;
    document.querySelector(".temp").innerText = temp + "°C";
    document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
    document.querySelector(".wind").innerText = "Wind Speed: " + speed + " km/h";
    document.body.style.backgroundImage = " url('https://source.unsplash.com/random/1600×900/?" + name + "')";
}

var myChart=null;
function drawGraph(graphData){
    document.getElementById("graphWrapper").style.display = "inline-block";
    var ctx = document.getElementById('Chart').getContext('2d');
    var myData = [];
    var myLabels = [];
    var count = graphData.cnt;
    
    for( let i=0;i<count;i=i+2) {
        myData.push(graphData.list[i].main.temp);
        myLabels.push((graphData.list[i].dt_txt));
    }

    //Odstranění starého grafu
    if(myChart!=null){
        myChart.destroy();
    }

    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: myLabels,
            datasets: [{
                
                data: myData,
                borderColor: "white",
                borderWidth: 2,
                lineTension: 0,
            }]
        },
        options: {
            legend: {
                display: false,
            },
            fill: false,
            responsive: true,

            scales: {
                xAxes: [{
                    ticks: {
                        fontColor: "white",

                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Den",
                        fontColor: "white"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: "black"
                    },
                    ticks: {
                        stepSize: 1,
                        fontColor: "white",

                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Teplota",
                        fontColor: "white"
                    }
                }]
            }
        }
    });
}

function inputValidation(searchText) {
    var regex = "^([a-zA-Z\u00C0-\u00D6\u00D8-\u00F6\u00F8-\u024F]+( |-)?)+$";
    if(searchText.match(regex)) {
        return true;
    }
    else {
        alert("Vyhledání obsahuje nepovolené znaky!")
        return false;
    }
}

document.querySelector(".search button").addEventListener("click", function(){
    let searchText = document.querySelector(".search-bar").value;
    if(searchText)
    {
        searchText = searchText.trim();
        if(inputValidation(searchText))
        {
            fetchWeather(document.querySelector(".search-bar").value);
        }
    }
    else
    {
        alert("Zadej nazev bez znaku!");
    }
    
});

document.querySelector(".search-bar").addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        fetchWeather(document.querySelector(".search-bar").value);

    }
});