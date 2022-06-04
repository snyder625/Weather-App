const express = require('express');
const bodyParser = require('body-parser');
const https = require('https');

const app = express();
app.set('view engine', 'ejs');

app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended: true}));

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html")
})

app.post("/", function(req, res) {
    const query = req.body.cityName;
    const unit = "metric";
    const apiKey = "f0cfa949f175c06d7ac16d17eef40bb7";

    const url = "https://api.openweathermap.org/data/2.5/weather?q=" + query + "&units=" + unit + "&appid=" + apiKey;

    https.get(url, function(response){
        response.on("data", function(data) {
            const weatherData = JSON.parse(data);
            const temperature = weatherData.main.temp;
            const icon = weatherData.weather[0].icon;
            const imageURL = "http://openweathermap.org/img/wn/" + icon + "@2x.png";
            const description = weatherData.weather[0].description;

            
            res.render('weather', {
                city: query,
                image: imageURL,
                temp:temperature
            });
        })
    })
})



app.listen(process.env.PORT || 3000, function(){
    console.log("Server is running on port 3000.");
})