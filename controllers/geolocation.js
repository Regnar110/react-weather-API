const e = require('express');
const NodeGeocoder = require('node-geocoder');
require('dotenv').config();
const geoCoderoptions = {
    provider: 'google',
    apiKey: process.env.REVERSE_GEO_LOCATION_KEY
}

const geocoder = NodeGeocoder(geoCoderoptions);
const current_date = new Date().toISOString().split('T')[0]
const end_date = new Date(new Date().setDate(new Date().getDate() + 7)).toISOString().split('T')[0]

const geoCodingFunction = async (geoData, res) => {
    const { city, country, latitude, longitude} = geoData;
    const getWeatherConditionsForCurrentCity = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=temperature_2m,apparent_temperature,rain,snowfall,weathercode,surface_pressure,cloudcover,visibility,windgusts_10m&daily=weathercode,sunrise,sunset&timezone=GMT&start_date=${current_date}&end_date=${end_date}`);
    const weatherConditions = await getWeatherConditionsForCurrentCity.json();
    res.send({
        city: city,
        country: country,
        currentWeather: weatherConditions
    })
}

const geoLocation = async (req, res) => {
    if(req.body.locationName) {
        const latLonPosition = await geocoder.geocode({address: req.body.locationName})
        const { city, country, latitude, longitude} = latLonPosition[0];
        geoCodingFunction({city, country, latitude, longitude}, res)
    } else if(req.body.latitude && req.body.longitude) {
        const {latitude, longitude} = req.body;
        const resPosition = await geocoder.reverse({ lat: latitude, lon: longitude });
        const {city, country} = resPosition[0];
        geoCodingFunction({city, country, latitude, longitude}, res)
    }
}

module.exports = {geoLocation}

// Mamy endpoint dla opcji w której użytkownikowi łądowana jest pogoda dla pozycji jego urządzenia
// teraz należy stworzyć endpoint dla użytkownika, który będzie chciał po nazwie miejscowości wyszukać jakieś miejsce i uzyskać dla niego dane pogodowe.


























// const returnOneDayWeatherConditions = (data) => {
//     // // delete data.daily.time
//     // // delete data.hourly.time
//     // const { sunrise, sunset } = data.daily;
//     const { apparent_temperature, cloudcover, rain, snowfall, visibility, weathercode} = data.hourly;
//     const newWeatherConditionsArray = [apparent_temperature, cloudcover, rain, snowfall, visibility, weathercode].map(el => {
//         const newElement = el.splice(24, 145)
//         return newElement
//         })
//     const newSunConditions = [sunrise, sunset].map(el => {
//         const newSunConditions = el.splice(1, 6)
//         return newSunConditions
//     })
//     return [newWeatherConditionsArray, newSunConditions];
// }