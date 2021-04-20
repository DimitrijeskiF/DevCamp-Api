const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');




dotenv.config({ path: './config/config.env' });
connectDB();

const bootcamps = require('./routes/bootcamps')
const app = express();
app.use(express.json());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}

app.use('/api/v1/bootcamps', bootcamps);
const PORT = process.env.PORT || 3000


const server = app.listen(PORT, () => {
    console.log(`App listening on port ${PORT} and is running in ${process.env.NODE_ENV} mode!`.yellow.bold);
});


//Handling unhandled promise rejections

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);

    //Close server
    server.close(() => {
        process.exit(1)
    })
})