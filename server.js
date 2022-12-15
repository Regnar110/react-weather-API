const {geoLocation} = require('./controllers/geolocation.js')
const express = require('express');
const cors = require('cors');
const port = 3600;

const app = express();
app.use(express.json()) // pozwala odczytać obiekt "body" requestu
app.use(cors());

app.post('/initCurrentUserGeoPosition', geoLocation)

app.listen(port, () =>{
    console.log(`server listening on ${port}`)
})