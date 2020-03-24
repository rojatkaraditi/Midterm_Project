class Student{
    constructor(student){
        this.studentId = student.s_id;
        this.departmentName = student.department_name;
        this.firstName = student.first_name;
        this.lastName = student.last_name;
        this.dateOfBirth = student.date_of_birth;
        this.phoneNumber = student.phone_number;
        this.address = student.address;
        this.studentType = student.student_type;
        this.semester = student.semester;
        this.gpa = student.gpa;
    }
}

module.exports = Student;