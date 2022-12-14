const express = require('express');
const NodeGeocoder = require('node-geocoder');
const cors = require('cors');
require('dotenv').config()
const port = 3600


const geoCoderoptions = {
    provider: 'google',
    apiKey: process.env.REVERSE_GEO_LOCATION_KEY,
  }

const app = express();
const geocoder = NodeGeocoder(geoCoderoptions);
app.use(express.json()) // pozwala odczytać obiekt "body" requestu
app.use(cors());


app.post('/appmount', async (req,res) => {
    const {lat, lon} = req.body;
    const resPosition = await geocoder.reverse({ lat: lat, lon: lon });
    const {city, country} = resPosition[0];
    res.send({
        city: city,
        country: country
    })
})

app.listen(port, () =>{
    console.log(`server listening on ${port}`)
})