const sql = require("./dbconfig.js");
const StudentObject = require("./Student.js");
const StudentCoursesObject = require("./StudentCourses.js");
const Promise = require('promise');

//find Students by query parameters
exports.findStudents= (request,response)=>{
    //creating search string and sanitizing and validating input
    queryStr = request.query;
    var queryParam = "";
    var sqlStatement = "" ;
        if(queryStr.id){
            queryParam = "where s_id="+queryStr.id;
            request.checkQuery('id','Invalid id').isInt().trim().escape();
        }
        if(queryStr.departmentId){
            if(queryParam){
                queryParam = queryParam.concat(" AND s.d_id=",queryStr.departmentId);
            }
            else{
                queryParam = "where s.d_id="+queryStr.departmentId;
            }
            request.checkQuery('departmentId','Invalid departmentId').isInt().trim().escape();
        }
        if(queryStr.firstName){
            if(queryParam){
                queryParam = queryParam.concat(" AND first_name='",queryStr.firstName.trim(),"'");
            }
            else{
                queryParam = "where first_name='"+queryStr.firstName.trim()+"'";
            }
            request.checkQuery('firstName','Invalid firstName').isAlpha().trim().escape();
        }
        if(queryStr.lastName){
            if(queryParam){
                queryParam = queryParam.concat(" AND last_name='",queryStr.lastName.trim(),"'");
            }
            else{
                queryParam = "where last_name='"+queryStr.lastName.trim()+"'";
            }
            request.checkQuery('lastName','Invalid lastName').isAlpha().trim().escape();
        }
        if(queryStr.dateOfBirth){
            if(queryParam){
                queryParam = queryParam.concat(" AND date_of_birth='",queryStr.dateOfBirth.trim(),"'");
            }
            else{
                queryParam = "where date_of_birth='"+queryStr.dateOfBirth.trim()+"'";
            }
            request.checkQuery('dateOfBirth','Invalid dateOfBirth').isValidDate();
        }
        if(queryStr.phoneNumber){
            if(queryParam){
                queryParam = queryParam.concat(" AND phone_number='",queryStr.phoneNumber.trim(),"'");
            }
            else{
                queryParam = "where phone_number='"+queryStr.phoneNumber.trim()+"'";
            }
            request.checkQuery('phoneNumber','Invalid phoneNumber').isNumeric().isLength({min:10,max:13}).trim().escape();
        }
        if(queryStr.address){
            if(queryParam){
                queryParam = queryParam.concat(" AND address='",queryStr.address.trim(),"'");
            }
            else{
                queryParam = "where address='"+queryStr.address.trim()+"'";
            }
        }
        if(queryStr.studentType){
            if(queryParam){
                queryParam = queryParam.concat(" AND student_type='",queryStr.studentType.trim(),"'");
            }
            else{
                queryParam = "where student_type='"+queryStr.studentType.trim()+"'";
            }
            request.checkQuery('studentType','Invalid studentType').isValidStudentType();
        }
        if(queryStr.semester){
            if(queryParam){
                queryParam = queryParam.concat(" AND semester=",queryStr.semester);
            }
            else{
                queryParam = "where semester="+queryStr.semester;
            }
            request.checkQuery('semester','Invalid semester').isInt();
        }
        if(queryStr.gpa){
            if(queryParam){
                queryParam = queryParam.concat(" AND gpa=",queryStr.gpa);
            }
            else{
                queryParam = "where gpa="+queryStr.gpa;
            }
            request.checkQuery('gpa','Invalid gpa').isFloat({min:0,max:4});
        }
        
        sqlStatement = "select s_id,d.d_name as department_name,first_name,last_name,date_of_birth,phone_number,address,student_type,semester,gpa from students s join departments d using (d_id) "+queryParam;
    
        var errors = request.validationErrors();

        if(!errors){
            //sql query to search students by search criteria
            sql.query(sqlStatement,(err,res)=>{
                if(err){
                    //Data Transformation
                    var result = {
                        'error': err,
                        'links':this.getLinks()
                    }
                    //send response
                    response.status(500).json(result);
                }
                else if(res.length>0){
                    //Data Transformation
                    var studentsObjects = [];
                    res.forEach(student=>{
                        studentsObjects.push(new StudentObject(student));
                    });
                    var result = {
                        "students": studentsObjects,
                        "links": this.getLinks()
                    }
                    //send response
                    response.status(200).json(result);
                }
                else{
                    //Data Transformation
                    var result = {
                        "students":[],
                        "links": this.getLinks()
                    }
                    //send response
                    response.status(200).json(result);
                }
            });
        }
        else{
            //Data Transformation
            var result = {
                'error': errors,
                'links':this.getLinks()
            }
            //send response
            response.status(400).json(result);
        }
}

//finding student by id
exports.findStudent=(request,response)=>{
    //input sanitazing and validation
    request.checkParams('id','Invalid student id').isInt().trim().escape();

    var errors = request.validationErrors();

    if(!errors){
        //sql query for fetching student data by student id
        var student_id = request.params.id;
        sql.query('select s_id,d.d_name as department_name,first_name,last_name,date_of_birth,phone_number,address,student_type,semester,gpa from students s join departments d using (d_id) where s_id='+student_id,(err,res)=>{
            if(err){
                //data transformation
                var result = {
                    'error': err,
                    'links':this.getLinks()
                }
                //send response
                response.status(500).json(result);
            }
            else if(res.length>0){
                //data tarnsformation
                var std = new StudentObject(res[0]);
                var result = {
                    "student":std,
                    "links": this.getLinks()
                }
                //send response
                response.status(200).json(result);
            }
            else{
                //data transformation
                var result = {
                    "student":{},
                    "links": this.getLinks()
                }
                //rsend esponse
                response.status(200).json(result);
            }
        });
    }
    else{
        //data transformation
        var result = {
            'error': errors,
            'links':this.getLinks()
        }
        //send response
        response.status(400).json(result);
    }
};

//find courses taken by a student
exports.findStudentCourses=(request,response)=>{
    //input sanitazing and validation
    request.checkParams('id','Invalid student id').isInt().trim().escape();

    var errors = request.validationErrors();

    if(!errors){
        var student_id = request.params.id;
        //sql query to get student courses
        sql.query('select sc.c_id,c.c_name as Course, sc.grade as Grade, sc.p_id, concat(p.first_name,\' \',p.last_name) as Professor from students_courses sc join courses c using (c_id) join professors p using (p_id) where sc.s_id='+student_id,(err,res)=>{
            if(err){
                //data transformation
                var result={
                    "error": err,
                    "links":this.getLinks()
                }
                //send response
                response.status(500).json(result);
            }
            else if(res.length>0){
                //sql query to fetch student information
                sql.query('select s_id, concat(first_name,\' \',last_name) as Student_Name from students where s_id='+student_id,(error,resp)=>{
                    if(error){
                        //data transformation
                        var result={
                            "error": error,
                            "links":this.getLinks()
                        }
                        //send response
                        response.status(500).json(result);
                    }
                    else if(resp.length>0){
                        //data transformation
                        var studentCourses = new StudentCoursesObject(resp[0],res);
                        var result={
                            "StudentCourses": studentCourses,
                            "links":this.getLinks()
                        }
                        //send response
                        response.status(200).json(result);
                    }
                    else{
                        //data transformation 
                        var result={
                            "StudentCourses": {},
                            "links":this.getLinks()
                        }
                        //send response
                        response.status(200).json(result);
                    }
                });
            }
            else{
                //data transformation
                var result={
                    "StudentCourses": {},
                    "links":this.getLinks()
                }
                //send result
                response.status(200).json(result);
            }
        });
    }
    else{
        //data transformation
        var result={
            "error": errors,
            "links":this.getLinks()
        }
        //send result
        response.status(400).json(result);
    }
};

//create a new student
exports.createStudent=(request,response)=>{
    //input sanitazing and validation
    request.checkBody('studentId','Student ID should not be specified').isEmpty();
    request.checkBody('departmentId','departmentId is required').notEmpty().trim().escape();
    request.checkBody('departmentId','Invalid departmentId').isInt();
    request.checkBody('firstName','firstName is required').notEmpty().trim().escape();
    request.checkBody('firstName','Invalid firstName').isAlpha().trim().escape();
    request.checkBody('lastName','lastName is required ').notEmpty().trim().escape();
    request.checkBody('lastName','Invalid lastName').isAlpha().trim().escape();
    request.checkBody('dateOfBirth','dateOfBirth is required').notEmpty().trim().escape();
    request.checkBody('dateOfBirth','Invalid dateOfBirth. Date should be in yyyy-mm-dd format').isValidDate();
    request.checkBody('phoneNumber','phoneNumber is required').notEmpty().trim().escape();
    request.checkBody('phoneNumber','Invalid phoneNumber').isNumeric().isLength({min:10,max:13}).trim().escape();
    request.checkBody('address','address is required').notEmpty().trim().escape();
    request.checkBody('studentType','studentType is required').notEmpty().trim().escape();
    request.checkBody('studentType','Invalid studentType').isValidStudentType();
    request.checkBody('semester','semester is required').notEmpty().trim().escape();
    request.checkBody('semester','Invalid semester').isInt();
    request.checkBody('gpa','gpa is required').notEmpty().trim().escape();
    request.checkBody('gpa','Invalid gpa').isFloat({min:0,max:4});
    
    var errors = request.validationErrors();

    if(!errors){
        var that = this;
        //input validation
        this.isDepartmentIdValid(request.body.departmentId).then(function(res){
            if(res){
                var requestBody = request.body;
                var student = {
                    'd_id' : requestBody.departmentId,
                    'first_name' : requestBody.firstName.trim(),
                    'last_name' : requestBody.lastName.trim(),
                    'date_of_birth' : requestBody.dateOfBirth.trim(),
                    'phone_number' : requestBody.phoneNumber.trim(),
                    'address' : requestBody.address.trim(),
                    'student_type' : requestBody.studentType.trim(),
                    'semester' : requestBody.semester,
                    'gpa' : requestBody.gpa
                };
                //sql query to create a new student
                sql.query('insert into students set ?',student,(err,res)=>{
                    if(err){
                        //data transformation
                        var result = {
                            "error":err,
                            "links":that.getLinks()
                        }
                        //send response
                        response.status(500).json(result);
                    }
                    else{
                        //data transformation
                        var result = {
                            'message': 'Student successfully created',
                            "links" : that.getLinks()
                        }
                        //send response
                        response.status(200).json(result);
                    }
                });
            }
            else{
                //data transformation
                var result = {
                    "error":'Department ID not present in records',
                    "links":that.getLinks()
                }
                //send response
                response.status(400).json(result);
            }
        });
    }
    else{
        //data transformation
        var result = {
            "error":errors,
            "links":this.getLinks()
        }
        //send response
        response.status(400).json(result);
    }
};

//bulk create student courses
exports.createStudentCourses=(request,response)=>{

    //input sanitization and valisation
    request.checkParams('id',"Invalid studentId").isInt().trim().escape();  
    request.checkBody('courses','courses array is required').notEmpty().trim().escape();
    request.checkBody('courses','courses should be an array').isArray();

    request.checkBody('courses','courseId is required').isCourseIdPresent();
    request.checkBody('courses','Invalid courseId').isCourseIdValid();
    request.checkBody('courses','professorId is required').isProfessorIdPresent();
    request.checkBody('courses','Invalid professorId').isProfessorIdValid();
    request.checkBody('courses','grade required').isGradePresent();
    request.checkBody('courses','Invalid grade. Grades can be A,B,C,U or N').isGradeValid();

    var errors = request.validationErrors();

    if(!errors){
        var that = this;
        //input validation
        this.isStudentValid(request.params.id).then(function(res){
            if(res){
                that.isStudentCourseDuplicate(request.body.courses).then(function(resl){
                    if(!resl){
                        that.isCourseValid(request.body.courses).then(function(resl){
                            if(!resl){
                                //data transformation
                                var result = {
                                    "error":"Some of the professor courses are not available in records",
                                    "links":that.getLinks()
                                }
                                //send response
                                response.status(400).json(result);
                            }
                            else{
                                that.isStudentCourseAlreadyPresent(request.params.id,request.body.courses).then(function(reslt){
                                    if(reslt){
                                        //data transformation
                                        var result = {
                                            "error":"Some of the courses have already been taken by student",
                                            "links":that.getLinks()
                                        }
                                        //send response
                                        response.status(400).json(result);
                                    }
                                    else{
                                        var requestBody = request.body;
                                        var courses = requestBody.courses;
                                        var student_id = request.params.id;
                                        var studentCourses = [];
                                    
                                        courses.forEach(course => {0
                                            studentCourses.push(new Array(student_id,course.courseId,course.professorId,course.grade.trim()));
                                        });
                                        //sql query to create the student courses
                                        sql.query('INSERT INTO students_courses VALUES ?',[studentCourses],(err,res)=>{
                                            if(err){
                                                //data transformation
                                                var result = {
                                                    "error":err,
                                                    "links":that.getLinks()
                                                }
                                                //send response
                                                response.status(500).json(result);
                                            }
                                            else{
                                                //data transformation
                                                var result = {
                                                    'message': 'Student courses successfully added',
                                                    "links":that.getLinks()
                                                }
                                                //send response
                                                response.status(200).json(result);
                                            }
                                        });
                                    }
                                });
                            }
                        });
                    }
                    else{
                        //data transformation
                        var result = {
                            'message': 'Courses are repeated in the list',
                            "links":that.getLinks()
                        }
                        //send response
                        response.status(200).json(result);
                    }
                })

            }
            else{
                //data transformation
                var result = {
                    "error":"Student not present in records",
                    "links":that.getLinks()
                }
                //send response
                response.status(400).json(result);
            }
        });
    }
    else{
        //data transformation
        var result = {
            "error":errors,
            "links":this.getLinks()
        }
        //send response
        response.status(400).json(result);
    }
};

//update student record
exports.updateStudent=(request,response)=>{
    //input sanitization and validation
    request.checkParams('id','Invalid student id').isInt().trim().escape();

    request.checkBody('studentId','Student ID should not be specified').isEmpty();
    request.checkBody('departmentId','departmentId is required').notEmpty().trim().escape();
    request.checkBody('departmentId','Invalid departmentId').isInt();
    request.checkBody('firstName','firstName is required').notEmpty().trim().escape();
    request.checkBody('firstName','Invalid firstName').isAlpha().trim().escape();
    request.checkBody('lastName','lastName is required ').notEmpty().trim().escape();
    request.checkBody('lastName','Invalid lastName').isAlpha().trim().escape();
    request.checkBody('dateOfBirth','dateOfBirth is required').notEmpty().trim().escape();
    request.checkBody('dateOfBirth','Invalid dateOfBirth. Date should be in yyyy-mm-dd format').isValidDate();
    request.checkBody('phoneNumber','phoneNumber is required').notEmpty().trim().escape();
    request.checkBody('phoneNumber','Invalid phoneNumber').isNumeric().isLength({min:10,max:13}).trim().escape();
    request.checkBody('address','address is required').notEmpty().trim().escape();
    request.checkBody('studentType','studentType is required').notEmpty().trim().escape();
    request.checkBody('studentType','Invalid studentType').isValidStudentType();
    request.checkBody('semester','semester is required').notEmpty().trim().escape();
    request.checkBody('semester','Invalid semester').isInt();
    request.checkBody('gpa','gpa is required').notEmpty().trim().escape();
    request.checkBody('gpa','Invalid gpa').isFloat({min:0,max:4});

    var errors = request.validationErrors();

    if(!errors){
        var that=this;
        //input validation
        this.isStudentValid(request.params.id).then(function(res){
            if(res){
                that.isDepartmentIdValid(request.body.departmentId).then(function(resl){
                    if(resl){
                        var requestBody = request.body;
                        var student_Id = request.params.id;
                        var student = {
                            'd_id' : requestBody.departmentId,
                            'first_name' : requestBody.firstName.trim(),
                            'last_name' : requestBody.lastName.trim(),
                            'date_of_birth' : requestBody.dateOfBirth.trim(),
                            'phone_number' : requestBody.phoneNumber.trim(),
                            'address' : requestBody.address.trim(),
                            'student_type' : requestBody.studentType.trim(),
                            'semester' : requestBody.semester,
                            'gpa' : requestBody.gpa
                        };
                            //sql query to update student record
                            sql.query('update students set ? where s_id='+student_Id,student,(err,res)=>{
                                if(err){
                                    //data transformation
                                    var result = {
                                        "error":err,
                                        "links":that.getLinks()
                                    }
                                    //send response
                                    response.status(500).json(result);
                                }
                                else{
                                    //data transformation
                                    var result = {
                                        'message': 'Student successfully updated',
                                        "links":that.getLinks()
                                    }
                                    //send response
                                    response.status(200).json(result);
                                }
                            });
                    }
                    else{
                        //data transformation
                        var result = {
                            "error":'departmentId not present in records',
                            "links":that.getLinks()
                        }
                        //send response
                        response.status(400).json(result);
                    }
                })
            }
            else{
                //data transformation
                var result = {
                    "error":'studentId not present in records',
                    "links":that.getLinks()
                }
                //send response
                response.status(400).json(result);
            }
        });
    }
    else{
        //data transformation
        var result = {
            "error":errors,
            "links":this.getLinks()
        }
        //send response
        response.status(400).json(result);
    }
};

//update the grade of a student course
exports.updateStudentCourses=(request,response)=>{
    //input sanitization and validation
    request.checkParams('studentId','Invalid student id').isInt().trim().escape();
    request.checkParams('courseId','Invalid course id').isInt().trim().escape();

    request.checkBody('studentId','Student id cannot be modified on student course').isEmpty();
    request.checkBody('courseId','Course id cannot be modified on student course').isEmpty();
    request.checkBody('professorId','Professor id cannot be modified on student course').isEmpty();
    request.checkBody('grade','grade is required').notEmpty().trim().escape();
    request.checkBody('grade','Invalid grade. Grades can be A,B,C,U or N').isCourseGradeValid();
   
    var errors = request.validationErrors();

    if(!errors){
        var that = this;
        //input validation
        this.isStudentCourseValid(request.params.studentId,request.params.courseId).then(function(res){
            if(res){
                var requestBody = request.body;
                var course_id = request.params.courseId;
                var student_id = request.params.studentId;
            
                var sqlQuery = "update students_courses set grade = '"+requestBody.grade+"' where s_id ="+student_id+" and c_id="+course_id;
                //sql query to update the grade of the student course
                sql.query(sqlQuery,(err)=>{
                    if(err){
                        //data transformation
                        var result = {
                            "error":err,
                            "links":that.getLinks()
                        }
                        //send response
                        response.status(500).json(result);
                    }
                    else{
                        //data transformation
                        var result = {
                            'message': 'Student course grade successfully updated',
                            "links":that.getLinks()
                        }
                        //send response
                        response.status(200).json(result);
                    }
                });
            }
            else{
                //data transformation
                var result = {
                    "error":"No such student course data exists in records",
                    "links":that.getLinks()
                }
                //send response
                response.status(400).json(result);
            }
        });
    }
    else{
        //data transformation
        var result = {
            "error":errors,
            "links":this.getLinks()
        }
        //send response
        response.status(400).json(result);
    }
    
};

//remove a student from records
exports.removeStudent=(request,response)=>{
    //input sanitization and validation
    request.checkParams('id','Invalid student id').isInt().trim().escape();

    var errors = request.validationErrors();
    if(!errors){
        var that = this;
        //input validation
        this.isStudentValid(request.params.id).then(function(res){
            if(res){
                student_id = request.params.id;
                //sql query to delete all student courses
                sql.query('delete from students_courses where s_id='+student_id,(err)=>{
                    if(err){
                        //data transformation
                        var result = {
                            "error":err,
                            "links":that.getLinks()
                        }
                        //send response
                        response.status(500).json(result);
                    }
                    else{
                        //sql query to delete student
                        sql.query('delete from students where s_id='+student_id,(error)=>{
                            if(error){
                                //data transformation
                                var result = {
                                    "error":error,
                                    "links":that.getLinks()
                                }
                                //send response
                                response.status(500).json(result);
                            }
                            else{
                                //data transformation
                                var result = {
                                    'message': 'Student successfully deleted',
                                    "links":that.getLinks()
                                }
                                //send response
                                response.status(200).json(result);
                            }
                        })
                    }
                });
            }
            else{
                //data transformation
                var result = {
                    "error":"student with id not present in record",
                    "links":that.getLinks()
                }
                //send response
                response.status(400).json(result);
            }
        });
    }
    else{
        //data transformation
        var result = {
            "error":errors,
            "links":this.getLinks()
        }
        //send response
        response.status(400).json(result);
    }
};

//delete a student course from records
exports.removeStudentCourse=(request,response)=>{
    //input sanitization and validation
    request.checkParams('studentId','Invalid student id').isInt().trim().escape();
    request.checkParams('courseId','Invalid course id').isInt().trim().escape();

    var errors = request.validationErrors();

    if(!errors){
        var that = this;
        //input validation
        this.isStudentCourseValid(request.params.studentId,request.params.courseId).then(function(res){
            if(res){
                student_id = request.params.studentId;
                course_id = request.params.courseId;
                //sql query to delete student course
                sql.query('delete from students_courses where s_id='+student_id+' AND c_id='+course_id,(err)=>{
                    if(err){
                        //data transformation
                        var result = {
                            "error":err,
                            "links":that.getLinks()
                        }
                        //send response 
                        response.status(500).json(result);
                    }
                    else{
                        //data transformation
                        var result = {
                            'message': 'Student course successfully deleted',
                            "links":that.getLinks()
                        }
                        //send response
                        response.status(200).json(result);
                    }
                });
            }
            else{
                //data transformation
                var result = {
                    "error":"No such student course data exists in records",
                    "links":that.getLinks()
                }
                //send response
                response.status(400).json(result);
            }
        });
    }
    else{
        //data transformation
        var result = {
            "error":errors,
            "links":this.getLinks()
        }
        //rend response
        response.status(400).json(result);
    }
};

//function to validate date format
exports.isValidDate=(value)=>{
    if(value){
        if (!value.match(/^\d{4}-\d{2}-\d{2}$/)) return false;
  
        const date = new Date(value);
        if (!date.getTime()) return false;
        return date.toISOString().slice(0, 10) === value;
    }
    else{
        return false;
    }
  }

  //function to validate the student type values
  exports.isValidStudentType=(value)=>{
      if(value=="Undergraduate" || value=="Masters" || value=="Doctorate" || value=="Post-Doctorate"){
          return true;
      }
      else{
          return false;
      }
}

//function to validate the course grade values
exports.isCourseGradeValid=(value)=>{
    if(value=="A" || value=="B" || value=="C" || value=="U" || value=="N"){
        return true;
    }
    else{
        return false;
    }
}

//function to validate if a department is present in records
exports.isDepartmentIdValid=(value)=>{
        return new Promise(function(resolve,reject){
            sql.query('select * from departments where d_id='+value,(err,res)=>{
                resolve(res.length > 0);
            });
        });
}

//function to validate if a student is present in records
exports.isStudentValid=(value)=>{
    return new Promise(function(resolve,reject){
        sql.query('select * from students where s_id='+value,(err,res)=>{
            resolve(res.length>0);
        });
    })
}

//function to validate if a student course is present in records
exports.isStudentCourseValid=(val1,val2)=>{
    return new Promise(function(resolve,reject){
        sql.query('select * from students_courses where s_id='+val1+" and c_id="+val2,(err,res)=>{
            resolve(res.length>0);
        })
    });
}
//functoin to validate if a course is offered by a professor
exports.isCourseValid=(courses)=>{
    return new Promise(function(resolve,reject){
        var count=0;
        courses.forEach(course=>{
            sql.query('select * from professors_courses where c_id='+course.courseId+" and p_id="+course.professorId,(err,res)=>{                
                if(res.length==0){
                    resolve(false);
                }
                count++;
                if(count==courses.length){
                    resolve(true);
                }
            });
        })
    });
}

//function to check if a course is already taken by a student
exports.isStudentCourseAlreadyPresent=(val,courses)=>{
    return new Promise(function(resolve,reject){
        var count=0;
        courses.forEach(course=>{
            sql.query('select * from students_courses where s_id='+val+" and c_id="+course.courseId,(err,res)=>{
                if(res.length>0){
                    resolve(true);
                }
                count++;
                if(count==courses.length){
                    resolve(false);
                }
            });
        });
    });
}

//function to validate duplicate courses in request
exports.isStudentCourseDuplicate=(courses)=>{
    return new Promise(function(resolve,reject){
         var count = 0;
        for(var i =0;i<courses.length;i++){
            var cid = courses[i].courseId;
            for(var j=0;j<courses.length;j++){
                var courseId = courses[j].courseId;
                if((i!=j) && (cid==courseId)){
                    count++;
                }
            }
        }
        resolve (count>0);
    });
}

//function to return all links of the API. (HATEOAS support)
exports.getLinks=()=>{
    var links=[
        {
            "method" : "get",
            "href" : "http://localhost:3000/api/v1/students"
        },
        {
            "method" : "get",
            "href" : "http://localhost:3000/api/v1/students/1"
        },
        {
            "method" : "get",
            "href" : "http://localhost:3000/api/v1/students/1/courses"
        },
        {
            "method" : "post",
            "href" : "http://localhost:3000/api/v1/students"
        },
        {
            "method" : "post",
            "href" : "http://localhost:3000/api/v1/students/1/courses"
        },
        {
            "method" : "put",
            "href" : "http://localhost:3000/api/v1/students/1"
        },
        {
            "method" : "patch",
            "href" : "http://localhost:3000/api/v1/students/1/courses/1"
        },{
            "method" : "delete",
            "href" : "http://localhost:3000/api/v1/students/1"
        },
        {
            "method" : "delete",
            "href" : "http://localhost:3000/api/v1/students/1/courses/1"
        },
        {
            "method" : "get",
            "href" : "http://localhost:3000/api/v1/professors"
        },
        {
            "method" : "get",
            "href" : "http://localhost:3000/api/v1/professors/1/courses"
        },
        {
            "method" : "get",
            "href" : "http://localhost:3000/api/v1/departments"
        },
        {
            "method" : "get",
            "href" : "http://localhost:3000/api/v1/courses"
        }
    ];
    return links;
}