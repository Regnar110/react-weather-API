const NodeGeocoder = require('node-geocoder');
require('dotenv').config();
const geoCoderoptions = {
    provider: 'google',
    apiKey: process.env.REVERSE_GEO_LOCATION_KEY
}

const geocoder = NodeGeocoder(geoCoderoptions);

const geoLocation = async (req, res) => {
    const {lat, lon} = req.body;
    const resPosition = await geocoder.reverse({ lat: lat, lon: lon });
    const {city, country} = resPosition[0];
    const getCityLocationKey = await fetch(`http://dataservice.accuweather.com/locations/v1/search.json?q=${city}&apikey=${process.env.ACCU_WEATHER_KEY}`);
    const cityLocationKey = await getCityLocationKey.json();
    const {Key} = cityLocationKey[0];
    const getCurrentWeatherForPosition = await fetch(`http://dataservice.accuweather.com/currentconditions/v1/${Key}?apikey=${process.env.ACCU_WEATHER_KEY}&details=true`);
    const currentWeather = await getCurrentWeatherForPosition.json();

    console.log(Key, currentWeather[0])
    res.send({
        city: city,
        country: country,
        currentWeather: currentWeather[0]
    })
}

module.exports = {geoLocation}