const express = require('express')
const {CreateCourse, GetAllCourses, GetSingleCourse, UpdateCourse, DeleteCourse, SearchCourses, RelatedCourse, GetCatagariseCourses, GetPopularCourses, AdminRelatedCourse, GetAllCatagories} = require('../Controler/CourseControle')
const { isAuthenticated, autherizedRole, buyedThisCourse } = require('../middleware/auth')

const courseRouter = express.Router()

courseRouter.post('/create-course', CreateCourse)
courseRouter.get('/get-all-course',GetAllCourses)
courseRouter.get('/get-single-course/:courseId',GetSingleCourse)
courseRouter.put('/update-course',UpdateCourse)
courseRouter.delete('/delete-course/:courseId',DeleteCourse)
courseRouter.get('/search-course', SearchCourses)
courseRouter.get('/sugested-course/:courseId', RelatedCourse)
courseRouter.get('/auther-sugested-course/:courseId', AdminRelatedCourse)
courseRouter.get('/catagory/:catagory', GetCatagariseCourses)
courseRouter.get('/popular-courses', GetPopularCourses)
courseRouter.get('/get-all-catagories', GetAllCatagories)

module.exports = courseRouter 