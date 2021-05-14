const path = require('path')
const express = require('express');
const dotenv = require('dotenv');
const morgan = require('morgan');
const colors = require('colors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/error');

const bootcamps = require('./routes/bootcamps')
const courses = require('./routes/courses');
const auth = require('./routes/auth');
const users = require('./routes/users');


const cookieParser = require('cookie-parser');

const config = require('./config/config');
const fileupload = require('express-fileupload');

dotenv.config({ path: './config/config.env' });
connectDB();

const app = express();
app.use(express.json());
app.use(cookieParser());

if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'))
}


app.use(fileupload());

app.use(express.static(path.join(__dirname, 'public')))

app.use('/api/v1/bootcamps', bootcamps);
app.use('/api/v1/courses', courses);
app.use('/api/v1/auth', auth);
app.use('/api/v1/users', users);


app.use(errorHandler);




/*Running the server*/

const PORT = process.env.PORT || 3000
const server = app.listen(PORT, () => {
    console.log(`App listening on port ${config.PORT} and is running in ${config.NODE_ENV} mode!`.yellow.bold);
});


/*Handling unhandled promise rejections*/

process.on('unhandledRejection', (err, promise) => {
    console.log(`Error: ${err.message}`.red);

    //Close server
    server.close(() => {
        process.exit(1)
    })
})