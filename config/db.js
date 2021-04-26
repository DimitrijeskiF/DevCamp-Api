const mongoose = require('mongoose');
const  config = require('../config/config');
const connectDB = async () => {
    const conn = await mongoose.connect(config.URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })

    console.log(`Mongodb Connected: ${conn.connection.host}`.cyan.bold);
}

// process.env.URI,
module.exports = connectDB;