require('dotenv').config();

const queryAutoComplete = async (req, res) => {
    const input = req.body.input;
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${process.env.GOOGLE_PLACE_AUTOCOMPLETE_KEY}`)
    const {predictions} = await response.json();
    const placesNamesArray = predictions.map(el => {
      return el.description;
    })
    res.send({
        data: placesNamesArray
    })
  }

module.exports = {queryAutoComplete}