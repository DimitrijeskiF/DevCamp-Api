const mongoose = require('mongoose');

const connectDB = async () => {
    const conn = await mongoose.connect(process.env.URI, {
        useCreateIndex: true,
        useNewUrlParser: true,
        useFindAndModify: false,
        useUnifiedTopology: true
    })

    console.log(`Mongodb Connected: ${conn.connection.host}`.cyan.bold);
}


module.exports = connectDB;