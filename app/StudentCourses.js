class StudentCourses{
    constructor(student,studentCourses){
        this.studentId = student.s_id;
        this.studentName = student.Student_Name;

        this.courses = [];
        studentCourses.forEach(course=>{
            var studentCourse = {
                "courseId" : course.c_id,
                "courseName": course.Course,
                "grade": course.Grade,
                "professorId": course.professorId,
                "professorName":course.Professor
            }
            this.courses.push(studentCourse);
        });
    }
}

module.exports = StudentCourses;