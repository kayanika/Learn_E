const UserRepository = require('../repository/user-info').UserRepository;
const userRepository = new UserRepository();

const Category_Course_Teacher_Info_Repository = require('../repository/category-course-info').Category_Course_Teacher_Info_Repository;
const infoRepository = new Category_Course_Teacher_Info_Repository();

exports.getHome = async(req, res, next) => {

    const userId = req.params.ID;

    const category_repo = await infoRepository.getTopCategories();
    console.log(category_repo);

    const course_repo = await infoRepository.getTopCourses();
    console.log(course_repo);

    const teacher_repo = await infoRepository.getTopTeachers();
    console.log(teacher_repo);

    const user_repo = await userRepository.findById(userId);
    console.log(user_repo);

    if (category_repo.success && category_repo.success && user_repo.success) {
        return res.render('home/home-view', {
            pageTitle: 'Home',
            path: '/home',
            isStudent: 'false',
            logged_in: 'true',
            categories: category_repo.data,
            courses: course_repo.data,
            teachers: teacher_repo.data,
            userInfo: user_repo.data[0]
        })
    }

    res.render('home/home-view', {
        pageTitle: 'Home',
        path: '/home',
        isStudent: 'true',
        logged_in: 'true',
        categories: [],
        courses: [],
        teachers: [],
        userInfo: user_repo.data[0]
    })

}


exports.getAbout = async(req, res, next) => {

    const userId = req.params.ID;

    const user_repo = await userRepository.findById(userId);
    console.log(user_repo);

    const testimonial_repo = await infoRepository.getTestimonials_about_learnE();
    console.log(testimonial_repo);

    if (testimonial_repo.success && user_repo.success) {
        return res.render('home/about-view.ejs', {
            pageTitle: 'About',
            path: '/about',
            isStudent: 'false',
            logged_in: 'true',
            testimonials: testimonial_repo.data,
            userInfo: user_repo.data[0]
        })
    }

    const url = '/teacher/user/' + userId + '/';
    res.redirect(url)

}

exports.getCourses = async(req, res, next) => {

    const userId = req.params.ID;

    const user_repo = await userRepository.findById(userId);
    console.log(user_repo);

    const category_repo = await infoRepository.getTopCategories();
    console.log(category_repo);

    if (category_repo.success && user_repo.success) {
        return res.render('home/courses-view.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'false',
            logged_in: 'true',
            categories: category_repo.data,
            userInfo: user_repo.data[0]
        })
    }

    const url = '/teacher/user/' + userId + '/';
    res.redirect(url)

}

exports.getTeachers = async(req, res, next) => {

    const userId = req.params.ID;

    const user_repo = await userRepository.findById(userId);
    console.log(user_repo);

    const teacher_repo = await infoRepository.getTopTeachers();
    console.log(teacher_repo);

    if (teacher_repo.success && user_repo.success) {
        return res.render('home/teacher-view.ejs', {
            pageTitle: 'Teachers',
            path: '/teachers',
            isStudent: 'false',
            logged_in: 'true',
            teachers: teacher_repo.data,
            userInfo: user_repo.data[0]
        })
    }

    const url = '/teacher/user/' + userId + '/';
    res.redirect(url)

}


/* */

exports.postSearch = async(req, res, next) => {

    const userId = req.params.ID;
    const user_repo = await userRepository.findById(userId);
    console.log(user_repo);

    let start = req.params.START;


    let searchReq = req.body.search_bar_req;
    console.log(searchReq);

    searchReq = searchReq.toLowerCase();

    let req_search = '%' + searchReq + '%';
    console.log(req_search)

    const search_repo = await infoRepository.getCoursesofSearch(req_search);
    console.log(search_repo);

    if (search_repo.success) {
        return res.render('home/course-list.ejs', {
            pageTitle: 'Courses',
            path: '/courses',
            isStudent: 'false',
            logged_in: 'true',
            req: searchReq,
            userInfo: user_repo.data[0],
            courses: search_repo.data,
            fromCategory: 'false',
            fromSearch: 'true',
            start: start
        })
    }


    let url = '/teacher/user/' + userId + '/';
    res.redirect(url);
}


exports.get_Category_view = async(req, res, next) => {

    const userId = req.params.ID;
    const user_repo = await userRepository.findById(userId);
    console.log('here : ', user_repo);

    const reqCategory = req.params.CATEGORY;
    console.log('here : ', reqCategory);

    let start = req.params.START;
    console.log(start);

    const search_repo = await infoRepository.getCoursesOfCatagory(reqCategory);
    console.log(search_repo);

    if (user_repo.success && search_repo.success) {
        return res.render('home/course-list.ejs', {
            pageTitle: 'Courses',
            path: '/profile',
            isStudent: 'false',
            logged_in: 'true',
            req: reqCategory,
            userInfo: user_repo.data[0],
            courses: search_repo.data,
            fromCategory: 'true',
            fromSearch: 'false',
            start: start
        })
    }

    let url = '/teacher/user/' + userId + '/';
    res.redirect(url);

}

exports.getProfileView = async(req, res, next) => {
    const userId = req.params.ID;
    const user_repo = await userRepository.findById(userId);
    console.log(user_repo);
    const coursesTaken = await userRepository.coursesCreatedByIndividualTeacher(userId);


    if (user_repo.success) {
        return res.render('profile/profile-view.ejs', {
            pageTitle: 'My Profile',
            path: '/profile',
            isStudent: 'false',
            logged_in: 'true',
            editReq: 'false',
            userInfo: user_repo.data[0],
            myCoursesReq: 'true',
            courses: coursesTaken.data,

        })
    }
}


exports.PostEditProfileView = async(req, res, next) => {
    const userId = req.params.ID;
    let user_repo = await userRepository.findById(userId);
    console.log(user_repo);
    const coursesTaken = await userRepository.coursesTaken(userId);

    const name = req.body.name;
    console.log("new name :", name)
    const email = req.body.email;
    console.log("new email :", email)
    const pass = req.body.pass;
    console.log("new password :", pass)
    const re_pass = req.body.re_pass;
    if (req.files) console.log("some file was uploaded ");
    else console.log("no file found");
    var file = req.files.uploaded_image;
    var img_name = file.name;
    console.log(img_name);
    file.mv('public/img/' + file.name);

    const updateUser = await userRepository.updateUser(userId, name, email, pass, img_name);
    // console.log(updateUser.data.success);
    user_repo = await userRepository.findById(userId);

    if (user_repo.success) {
        return res.render('profile/profile-view.ejs', {
            pageTitle: 'My Profile',
            path: '/profile',
            isStudent: 'false',
            logged_in: 'true',
            editReq: 'false',
            userInfo: user_repo.data[0],
            myCoursesReq: 'true',
            courses: coursesTaken.data,

        })
    }
}
exports.editProfileView = async(req, res, next) => {
    const userId = req.params.ID;
    const user_repo = await userRepository.findById(userId);
    console.log(user_repo);
    const coursesTaken = await userRepository.coursesCreatedByIndividualTeacher(userId);


    if (user_repo.success) {
        return res.render('profile/profile-view.ejs', {
            pageTitle: 'My Profile',
            path: '/profile',
            isStudent: 'false',
            logged_in: 'true',
            editReq: 'true',
            userInfo: user_repo.data[0],
            myCoursesReq: 'false',
            courses: coursesTaken.data,

        })

    }
}


exports.get_course_view = async(req, res, next) => {
    const userId = req.params.ID;
    const user_repo = await userRepository.findById(userId);
    console.log('here : ', user_repo);

    const courseId = req.params.CRSID;
    console.log('here : ', courseId);
    const course_repo = await infoRepository.findCourseById(courseId);
    console.log('here : ', course_repo);
    const courseTeacher_repo = await infoRepository.findCourseTeacherById(courseId);
    console.log('here : ', courseTeacher_repo);
    const content_repo = await infoRepository.getContentsOfCourse(courseId);
    console.log(content_repo);
    const review_repo = await infoRepository.findReviewsOfCourse(courseId);
    console.log("REVIEWS :", review_repo);
    const TopCourse_repo = await infoRepository.getTopCourses();
    console.log(TopCourse_repo);


    if (user_repo.success && course_repo.success && content_repo.success) {
        return res.render('course/course-view.ejs', {
            pageTitle: 'Course',
            path: '/course',
            isStudent: 'false',
            logged_in: 'true',
            userInfo: user_repo.data[0],
            course: course_repo.data[0],
            teachers: courseTeacher_repo.data,
            reviews: review_repo.data,
            topCourses: TopCourse_repo.data,
            contents: content_repo.data

        })
    }

    let url = '/teacher/user/' + userId + '/';
    res.redirect(url);

}


exports.get_pre_add_course = async(req, res, next) => {
    const userId = req.params.ID;
    const user_repo = await userRepository.findById(userId);
    console.log(user_repo);

    if (user_repo.success) {
        return res.render('course/add-a-course-view.ejs', {
            pageTitle: 'Add Course',
            path: '/addCourse',
            isStudent: 'false',
            logged_in: 'true',
            userInfo: user_repo.data[0],
            create_button: 'false' ////

        })
    }

    let url = '/teacher/user/' + userId + '/';
    res.redirect(url);


}


exports.post_pre_add_course = async(req, res, next) => {
    const userId = req.params.ID;
    const id_repo = await infoRepository.last_course_id_inserted();
    console.log(id_repo)
    const new_id = id_repo.data[0].id + 1;
    console.log(new_id)

    const title = req.body.course_name;
    console.log(title);

    const course_repo = await infoRepository.add_new_course(new_id, title);
    console.log(course_repo);

    const add_repo = await infoRepository.add_teacher_into_new_course(userId, new_id);
    console.log(add_repo);

    let url = '/teacher/user/' + userId + '/add-course/' + new_id;
    res.redirect(url);
}


exports.get_add_course = async(req, res, next) => {
    const userId = req.params.ID;
    const courseId = req.params.CRSID;

    const user_repo = await userRepository.findById(userId);
    console.log('user : ', user_repo);

    const course_repo = await infoRepository.findCourseById(courseId);
    console.log('course repo : ', course_repo);

    const teachers_repo = await infoRepository.findCourseTeacherById(courseId);
    console.log('teacher-repo', teachers_repo);


    if (user_repo.success && course_repo.success) {
        return res.render('course/add-a-course-view.ejs', {
            pageTitle: 'Add Course',
            path: '/addCourse',
            isStudent: 'false',
            logged_in: 'true',
            userInfo: user_repo.data[0],
            courseInfo: course_repo.data[0],
            create_button: 'true',
            teachers_in: teachers_repo.data,
            req_teachers: []

        })
    }

    let url = '/teacher/user/' + userId + '/';
    res.redirect(url);
}

exports.post_search_add_course = async(req, res, next) => {
    const userId = req.params.ID;
    const courseId = req.params.CRSID;
    const user_repo = await userRepository.findById(userId);
    console.log('there : ', user_repo);

    const course_repo = await infoRepository.findCourseById(courseId);
    console.log('there : ', course_repo);

    const teachers_repo = await infoRepository.findCourseTeacherById(courseId);
    console.log('teacher-repo', teachers_repo);

    let req_src = req.body.search_bar_req;
    console.log(req_src);

    req_src = '%' + req_src + '%';

    const req_src_teacher_repo = await infoRepository.searchTeacherByTeacherName(req_src);
    console.log(req_src_teacher_repo);

    if (user_repo.success && course_repo.success && req_src_teacher_repo) {
        return res.render('course/add-a-course-view.ejs', {
            pageTitle: 'Add Course',
            path: '/addCourse',
            isStudent: 'false',
            logged_in: 'true',
            userInfo: user_repo.data[0],
            courseInfo: course_repo.data[0],
            create_button: 'true',
            teachers_in: teachers_repo.data,
            req_teachers: req_src_teacher_repo.data

        })
    }

    let url = '/teacher/user/' + userId + '/';
    res.redirect(url);

}


exports.get_add_course_add_teacher = async(req, res, next) => {

    const userId = req.params.ID;
    const courseId = req.params.CRSID;
    const new_teacher_id = req.params.TEACHID;

    console.log('course id : ', courseId);
    console.log('new_teacher_id : ', new_teacher_id);


    const temp_repo = await infoRepository.add_teacher_into_new_course(new_teacher_id, courseId);
    console.log(temp_repo);

    let url = '/teacher/user/' + userId + '/add-course/' + courseId;
    res.redirect(url);

}