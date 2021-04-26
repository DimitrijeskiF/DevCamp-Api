const NodeGeocoder = require('node-geocoder');
const config = require('../config/config');

const options = {
    provider: config.GEOCODER_PROVIDER,
    httpAdapter: 'https',
    apiKey: config.GEOCODE_API_KEY,
    formatter: null
};

const geocoder = NodeGeocoder(options);

module.exports = geocoder;