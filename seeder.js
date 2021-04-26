const fs = require('fs');
const mongoose = require('mongoose');
const colors = require('colors');
const config = require('./config/config');


const Bootcamp = require('./models/Bootcamp');
const Course = require('./models/Course');


mongoose.connect(config.URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
});

const bootcamps = JSON.parse(fs.readFileSync(`${__dirname}/_data/bootcamps.json`, 'utf-8'));

const courses = JSON.parse(fs.readFileSync(`${__dirname}/_data/courses.json`, 'utf-8'));


//Import in db

const importData = async () => {
    try {
        await Bootcamp.create(bootcamps);
        await Course.create(courses);
        console.log('Data imported...'.green.inverse);
        process.exit()
    } catch (error) {
        console.log(error);
    }
}


//Delete Data

const deleteData = async () => {
    console.log(courses);
    try {
        await Bootcamp.deleteMany()
        await Course.deleteMany();
        console.log('Data destroyed...'.red.inverse);
        process.exit();
    } catch (error) {
        console.log(error);
    }
}


if (process.argv[2] === '-i') {
    importData();
} else if (process.argv[2] === '-d') {
    deleteData()
}
