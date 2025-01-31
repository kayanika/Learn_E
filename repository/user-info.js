const Repository = require('./database').Repository;

class UserRepository extends Repository {
    constructor() {
        super();
    }
    findById = async function(userId) {
        const query = 'select * from "User" where "User_ID" = :1';
        const params = [userId];
        const result = await this.query(query, params, 'false');
        return result;
    }

    findByEmail = async function(userEmail,pass) {
        const query = 'select * from "User" where "Email" = :1 AND "Password"= :2 ';
        const params = [userEmail,pass];
        const result = await this.query(query, params, 'false');
        return result;
    }

    addUser = async function(id, name, email, password, student, image) {
        console.log({ id, name, email, password, image })

        const query = 'insert into "User"("User_ID", "Username", "Email", "Password","image") values(:1, :2, :3, :4, :6)';
        const params = [id, name, email, password, image];
        const result = await this.query(query, params, 'true');

        if (student) {
            const query = 'insert into "Student"("Student_id") values(:1)';
            const params = [id];
            const result = await this.query(query, params, 'true');
        } else {
            const query = 'insert into "Teacher"("Teacher_ID") values(:1)';
            const params = [id];
            const result = await this.query(query, params, 'true');
        }
        return result;
    }

    isStudent = async function(userEmail) {
        const query = 'select "Student_id" from "Student" where "Student_id"=( select "User_ID" from "User" where "Email" = :1)';
        const params = [userEmail];
        const result = await this.query(query, params, 'false');
        return result;
    }

    isTeacher = async function(userEmail) {
        const query = 'select "Teacher_ID" from "Teacher" where "Teacher_ID"=( select "User_ID" from "User" where "Email" = :1)';
        const params = [userEmail];
        const result = await this.query(query, params, 'false');
        return result;
    }

    last_user_id_inserted = async function() {
        const query = 'select MAX("User_ID")AS "id" from "User" ';
        const params = [];
        const result = await this.query(query, params, 'false');
        return result;
    }
    coursesTaken = async function(user_ID) {
        const query = 'SELECT  "Title","Course_ID","Rating",GET_PROGRESS("Course_ID",201805112) AS PROGRESS FROM ( "Student"  JOIN "PurchaseHistory" ON("Student_id"="Student_ID")) JOIN "Course" ON("course_id"="Course_ID") WHERE "Student_ID"= : 1';
        const params = [user_ID];
        const result = await this.query(query, params, 'false');
        return result;
    }
    getReviewByStudent=async function(course_id,user_ID){
        const query = 'select * from "Rating" WHERE "Course_ID"=:1 AND "Student_ID"=:2 ';
        const params = [course_id,user_ID];
        const result = await this.query(query, params, 'false');
        return result;
    }
    updateUser = async function(user_ID, userName, Email, Password, Image) {
        const query = 'UPDATE "User" SET "Name"= :2, "Email"= :3,"Password"= :4, "image"= :5 WHERE "User_ID"= :1 ';
        const params = [userName, Email, Password, Image, user_ID];
        console.log("parameters ", params);
        const result = await this.query(query, params, 'true');
        return result;
    }
    coursesCreatedByIndividualTeacher = async function(user_ID) {
        const query = 'SELECT * FROM ( "Teacher"  JOIN "CreateCourse" USING("Teacher_ID")) JOIN "Course" ON("course_id"="Course_ID") WHERE "Teacher_ID"= :1';
        const params = [user_ID];
        const result = await this.query(query, params, 'false');
        return result;
    }
    searchTeacherByTeacherName= async function(teacher_Name) {
        const query ='SELECT * FROM ("User"  JOIN "Teacher" ON("User_ID"="Teacher_ID")) WHERE "Name"= :1';
        const params = [teacher_Name];
        const result = await this.query(query, params, 'false');
        return result;
    }
    getGrades = async function(user_ID,course_ID) {
        const query = 'SELECT * FROM "Grades" WHERE "Student_ID"= :1 AND "Course_ID"= :2';
        const params = [user_ID,course_ID];
        const result = await this.query(query, params, 'false');
        return result;
    }


}


exports.UserRepository = UserRepository;