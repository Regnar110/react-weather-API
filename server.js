const { geoLocation } = require('./controllers/geolocation.js')

const express = require('express');
const NodeGeocoder = require('node-geocoder');
const cors = require('cors');
require('dotenv').config();
const port = 3600;

const geoCoderoptions = {
    provider: 'google',
    apiKey: process.env.REVERSE_GEO_LOCATION_KEY,
  }

const app = express();
const geocoder = NodeGeocoder(geoCoderoptions);
app.use(express.json()) // pozwala odczytać obiekt "body" requestu
app.use(cors());


app.post('/geolocation', (res, req) => geoLocation(res, req))

app.listen(port, () =>{
    console.log(`server listening on ${port}`)
})