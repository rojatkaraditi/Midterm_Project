//Object to handle professor data
class Professor{
    constructor(professor){
        this.professorId=professor.p_id;
        this.departmentName = professor.department_name;
        this.firstName = professor.first_name;
        this.lastName = professor.last_name;
        this.dateOfBirth = professor.date_of_birth;
        this.phoneNumber = professor.phone_number;
        this.address = professor.address;
    }
}

module.exports = Professor;