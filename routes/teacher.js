const express = require('express');

const teacherController = require('../controllers/teacher')


//const router = express.Router()
const router = require('express-promise-router')()

router.get('/user/:ID/', teacherController.getHome)

router.get('/user/:ID/about', teacherController.getAbout)

router.get('/user/:ID/courses', teacherController.getCourses)

router.get('/user/:ID/teachers', teacherController.getTeachers)


/* */

router.post('/user/:ID/search/:START', teacherController.postSearch)

router.get('/user/:ID/category-view/:CATEGORY/:START', teacherController.get_Category_view)

router.get('/user/:ID/course-view/:CRSID', teacherController.get_course_view)

router.get('/user/:ID/add-course', teacherController.get_add_course)





module.exports = router