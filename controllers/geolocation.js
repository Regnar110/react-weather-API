const NodeGeocoder = require('node-geocoder');
require('dotenv').config();
const geoCoderoptions = {
    provider: 'google',
    apiKey: process.env.REVERSE_GEO_LOCATION_KEY
}

const geocoder = NodeGeocoder(geoCoderoptions);
const current_date = new Date()
const end_date = new Date(new Date().setDate(new Date().getDate() + 7))

const returnOneDayWeatherConditions = (data) => {
    delete data.daily.time
    delete data.hourly.time
    const { sunrise, sunset } = data.daily;
    const { apparent_temperature, cloudcover, rain, snowfall, visibility, weathercode} = data.hourly;
    const newWeatherConditionsArray = [apparent_temperature, cloudcover, rain, snowfall, visibility, weathercode].map(el => {
        const newElement = el.splice(24, 145)
        return newElement
        })
    const newSunConditions = [sunrise, sunset].map(el => {
        const newSunConditions = el.splice(1, 6)
        return newSunConditions
    })
    return [newWeatherConditionsArray, newSunConditions];
}

const geoLocation = async (req, res) => {
    const {lat, lon} = req.body;
    const resPosition = await geocoder.reverse({ lat: lat, lon: lon });
    const {city, country} = resPosition[0];
    const getWeatherConditionsForCurrentCity = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=13.41&current_weather=true&hourly=rain,weathercode,visibility,snowfall,cloudcover,apparent_temperature&daily=sunrise,sunset&timezone=GMT`);
    const weatherConditions = await getWeatherConditionsForCurrentCity.json();
    returnOneDayWeatherConditions(weatherConditions);
    res.send({
        city: city,
        country: country,
        currentWeather: weatherConditions
    })
}

module.exports = {geoLocation}

// Mamy endpoint dla opcji w której użytkownikowi łądowana jest pogoda dla pozycji jego urządzenia
// teraz należy stworzyć endpoint dla użytkownika, który będzie chciał po nazwie miejscowości wyszukać jakieś miejsce i uzyskać dla niego dane pogodowe.