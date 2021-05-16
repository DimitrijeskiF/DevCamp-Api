const mongoose = require('mongoose')

const ReviewSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
        required: [true, 'Please add a title for the review'],
        maxlength: 100
    },
    text: {
        type: String,
        required: [true, 'Please add som text'],
    },
    rating: {
        type: Number,
        min: 1,
        max: 10,
        required: [true, 'Please add a retting between 1 and 10'],
    },
    ceratedAt: {
        type: Date,
        default: Date.now
    },
    bootcamp: {
        type: mongoose.Schema.ObjectId,
        ref: 'Bootcamp',
        required: true
    },
    user: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true
    }
});

//Prevent user from submitting more then one review per Bootcamp :)

ReviewSchema.index({
    bootcamp: 1,
    user: 1
}, { unique: true })


//Static method to get avg of rating
ReviewSchema.statics.getAverageRating = async function (bootcampId) {
    const obj = await this.aggregate([
        {
            $match: { bootcamp: bootcampId }
        },
        {
            $group: {
                _id: '$bootcamp',
                averageRating: { $avg: '$rating' }
            }
        }
    ]);


    try {
        await this.model('Bootcamp').findByIdAndUpdate(bootcampId, {
            averageRating: obj[0].averageRating
        })
    } catch (error) {
        console.log(error);
    }
}


//getAverage cost after save

ReviewSchema.post('save', function () {
    this.constructor.getAverageRating(this.bootcamp);
})

//Before removing course

ReviewSchema.pre('remove', function () {
    this.constructor.getAverageRating(this.bootcamp);
})

module.exports = mongoose.model('Review', ReviewSchema);


