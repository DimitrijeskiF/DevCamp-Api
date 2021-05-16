const express = require('express');
const { protect, authorize } = require('../middleware/auth')
const {
    getBootcamps,
    getBootcamp,
    createBootcamp,
    updateBootcamp,
    deleteBootcamp,
    getBootcampsInRadius,
    bootcampPhotoUpload
} = require('../controllers/bootcamps');
const advancedResults = require('../middleware/advancedResults');

const Bootcamp = require('../models/Bootcamp');

//Include other resource routers

const courseRouter = require('./courses')
const reviewsRouter = require('./reviews');

const router = express.Router();

//Re-route into other resource routers..
//everything that comes to this route go to the router
router.use('/:bootcampId/courses', courseRouter)
router.use('/:bootcampId/reviews', reviewsRouter)


router.route('/radius/:zipcode/:distance')
    .get(getBootcampsInRadius)

router
    .route('/:id/photo')
    .put(protect, authorize('publisher', 'admin'), bootcampPhotoUpload);

router
    .route('/')
    .get(advancedResults(Bootcamp, 'courses'), getBootcamps)
    .post(protect, authorize('publisher', 'admin'), createBootcamp)

router
    .route('/:id')
    .get(getBootcamp)
    .put(protect, authorize('publisher', 'admin'), updateBootcamp)
    .delete(protect, authorize('publisher', 'admin'), deleteBootcamp)

module.exports = router