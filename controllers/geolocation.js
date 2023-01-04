const NodeGeocoder = require('node-geocoder');
require('dotenv').config();
const geoCoderoptions = {
    provider: 'google',
    apiKey: process.env.REVERSE_GEO_LOCATION_KEY
}

const geocoder = NodeGeocoder(geoCoderoptions);
const current_date = new Date().toISOString().split('T')[0]
const end_date = new Date(new Date().setDate(new Date().getDate() + 6)).toISOString().split('T')[0]

const geoCodingFunction = async (geoData, res) => {
    try{
        const { city, country, latitude, longitude} = geoData;
        console.log(`GEOCODING city: ${city}`)
        const getTimeForLocation = await fetch(`https://maps.googleapis.com/maps/api/timezone/json?location=${latitude},${longitude}&timestamp=1331161200&key=${process.env.REVERSE_GEO_LOCATION_KEY}`)
        const timeForLocation = await getTimeForLocation.json();
        console.log(timeForLocation)
        const getWeatherConditionsForCurrentCity = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=windspeed_10m,apparent_temperature,weathercode,surface_pressure,cloudcover,windspeed_10m&daily=weathercode,temperature_2m_max,temperature_2m_min,apparent_temperature_max,apparent_temperature_min,sunrise,sunset,rain_sum,showers_sum,snowfall_sum&timezone=${timeForLocation.timeZoneId}&start_date=${current_date}&end_date=${end_date}`);
        const weatherConditions = await getWeatherConditionsForCurrentCity.json();
        res.send({
            city: city,
            country: country,
            currentWeather: weatherConditions,
            currentLocationTime: new Date().toLocaleString("en-US", { timeZone: `${timeForLocation.timeZoneId}`, hour12: false, hour: '2-digit', minute:'2-digit'})
        })
    } catch(err) {
        res.send({
            error:err,
            message: 'Failed to execute in geocoding()'
        })
    }
}

const geoLocation = async (req, res) => {
    try {
        if(req.body.locationName) { // here is going to be a timeZone API initiation to get timezone and time for current searched location
            const latLonPosition = await geocoder.geocode({address: req.body.locationName})
            const { city, country, latitude, longitude} = latLonPosition[0];
            geoCodingFunction({city, country, latitude, longitude}, res)
        } else if(req.body.latitude && req.body.longitude) {
            const {latitude, longitude} = req.body;
            const resPosition = await geocoder.reverse({ lat: latitude, lon: longitude });
            const {city, country} = resPosition[0];
            geoCodingFunction({city, country, latitude, longitude}, res)
        }
    } catch(err) {
        res.send({
            error: err,
            message: 'Failed to execute in geoLocation()'
        })
    }
}

module.exports = {geoLocation}














