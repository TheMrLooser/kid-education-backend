const express = require('express');
const { BuyNewCourse, RemoveFromMyCourse, GetAllBuyedCourse } = require('../Controler/MyCourseControler');

const myCourseRouter = express.Router()

myCourseRouter.post('/buy-new-course',BuyNewCourse)
myCourseRouter.delete('/remove-from-my-course/:courseId',RemoveFromMyCourse)
myCourseRouter.get('/get-all-buyed-courses',GetAllBuyedCourse) 

module.exports = myCourseRouter