let weather = {
    apiKey: "3ef6cb33f000407b1e7c61ac7686290d",
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=metric&appid=" + this.apiKey)
            .then((response) => {
                if(!response.ok) {
                    alert("Nenašlo se počasí.")
                    throw new Error("Nenašlo se počasí.");
                }
            this.fetchGraphWeather(city);
            return response.json();})
            .then((data) => this.displayWeather(data));
    },
    fetchGraphWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/forecast?q=" + city + "&units=metric&appid=" + this.apiKey)
            .then((response) => {
                if(!response.ok) {
                    alert("Nenašlo se počasí.")
                    throw new Error("Nenašlo se počasí.");
                }
            return response.json();})
            .then(response => {
                DrawGraph(response)
            });
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;
        document.querySelector(".city").innerText = name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + "@2x.png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind Speed: " + speed + " km/h";
        document.body.style.backgroundImage = " url('https://source.unsplash.com/random/1600×900/?" + name + "')";
    },
    search: function(){
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

function inputValidation(searchText) {
    var regex = "^[A-Za-z]+$";
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
            weather.search(); 
        }
    }
    
});

document.querySelector(".search-bar").addEventListener("keyup", function(event){
    if(event.key == "Enter"){
        let searchText = document.querySelector(".search-bar").value;
        if(searchText)
        {
            searchText = searchText.trim();
            if(inputValidation(searchText))
            {
                weather.search(); 
            }
        }
    }
});

var myChart=null;
function DrawGraph(graphData){
    document.getElementById("graphWrapper").style.display = "inline-block";
    var ctx = document.getElementById('Chart').getContext('2d');
    var myData = [];
    var myLabels = [];
    var count = graphData.cnt;
    
    for( let i=0;i<count;i=i+2) {
        myData.push(graphData.list[i].main.temp);
        myLabels.push((graphData.list[i].dt_txt));
    }

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
                pointBackgroundColor: "white",
                borderWidth: 3,
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
                    gridLines: {
                        color: "white"
                    },
                    display: true,
                    scaleLabel: {
                        display: true,
                        labelString: "Dny",
                        fontColor: "white"
                    }
                }],
                yAxes: [{
                    gridLines: {
                        color: "white"
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




