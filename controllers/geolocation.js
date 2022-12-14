const geoLocation = async (res, req) => {
    console.log(req)
    const {lat, lon} = req.body;
    const resPosition = await geocoder.reverse({ lat: lat, lon: lon });
    const {city, country} = resPosition[0];
    res.send({
        city: city,
        country: country
    })
}

module.exports = {geoLocation}