const ErrorResponse = require('../utils/errorResponse');
const asyncHandler = require('../middleware/async');
const Course = require('../models/Course');
const Bootcamp = require('../models/Bootcamp');



exports.getCourses = asyncHandler(async (req, res, next) => {
    let query;
    if (req.params.bootcampId) {
        const courses = await Course.find({ bootcamp: req.params.bootcampId });
        return res.status(200).json({
            success: true,
            count: courses.length,
            data: courses
        })
    } else {
        res.status(200).json(res.advancedResults)
    }
})

exports.getCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id).populate({
        path: 'bootcamp',
        select: 'name description'
    })

    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.id}`), 404)
    }

    res.status(200).json({
        success: true,
        data: course
    })
})


//ADD Course
// Route    post  /api/v1/bootcamps/:bootcampId/course

exports.addCourse = asyncHandler(async (req, res, next) => {
    req.body.bootcamp = req.params.bootcampId
    const bootcamp = await Bootcamp.findById(req.params.bootcampId)
    if (!bootcamp) {
        return next(new ErrorResponse(`No bootcamp with the id of ${req.params.bootcampId}`), 404)

    }

    const course = await Course.create(req.body);

    res.status(200).json({
        success: true,
        data: course
    })
})


exports.updateCourse = asyncHandler(async (req, res, next) => {
    let course = await Course.findById(req.params.id)
    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.bootcampId}`), 404)

    }

    course = await Course.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    })
    res.status(200).json({
        success: true,
        data: course
    })
})


exports.deleteCourse = asyncHandler(async (req, res, next) => {
    const course = await Course.findById(req.params.id)
    if (!course) {
        return next(new ErrorResponse(`No course with the id of ${req.params.bootcampId}`), 404)

    }

    await Course.remove();
    res.status(200).json({
        success: true,
        data: {}
    })
})




