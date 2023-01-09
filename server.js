const {geoLocation} = require('./controllers/geolocation.js')
const {queryAutoComplete} = require('./controllers/queryAutoComplete.js')
const express = require('express');
const cors = require('cors');
const port = 3600;

const app = express();
app.use(express.json()) // pozwala odczytać obiekt "body" requestu
app.use(cors());
app.set('trust proxy', true);

app.post('/initCurrentUserGeoPosition', geoLocation)

app.post('/suggestions', queryAutoComplete);

app.listen(process.env.PORT || 3000, () => console.log(process.env.PORT))