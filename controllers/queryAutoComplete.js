require('dotenv').config();

const queryAutoComplete = async (req, res) => {
    const input = req.body.input;
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${input}&types=(cities)&key=${process.env.GOOGLE_PLACE_AUTOCOMPLETE_KEY}`)
    const {predictions} = await response.json();
    const filteredPredictions = predictions.filter(el => el.types[0]==='locality') // locality to właściwośc obiektów sugerujących miejsce. Reprezentuje ona obiekty, zwracające tylko miasta jako sugestie, bez sugesti dotyczących rejonów administracyjnych np. powiaty
    const placesNamesArray = filteredPredictions.map(el => {
      const {description, structured_formatting} = el;
      const {main_text} = structured_formatting;
      return [description, main_text]
    })
    res.send({
        data: placesNamesArray
    })
  }

module.exports = {queryAutoComplete}