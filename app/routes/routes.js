const express = require("express");
const studentController = require("../students.controller");
const professorController = require("../professors.controller");
const departmentsController = require("../departments.controller");
const coursesController = require("../courses.controller");
var expressValidator = require('express-validator');
var validator = require('validator');

const route = express.Router();

route.use(expressValidator({
    customValidators: {
      isValidDate: studentController.isValidDate,
      isValidStudentType : studentController.isValidStudentType,
      isCourseGradeValid : studentController.isCourseGradeValid,
      isCourseIdPresent: function(values){
        return values.every(function(val){
            if(val.courseId!= undefined)
                return !validator.isEmpty(val.courseId.toString());
            else
                return false
        });
      },
      isCourseIdValid: function(values){
            return values.every(function(val){
                if(val.courseId!= undefined)
                    return validator.isInt(val.courseId.toString());
                else    
                    return false;
            });
      },
      isProfessorIdPresent: function(values){
        return values.every(function(val){
            if(val.professorId!= undefined)
                return !validator.isEmpty(val.professorId.toString());
            else
                return false;
        });
      },
      isProfessorIdValid: function(values){
        return values.every(function(val){
            if(val.professorId!= undefined)
                return validator.isInt(val.professorId.toString());
            else
                return false;
        });
      },
        isGradePresent: function(values){
            return values.every(function(val){
                if(val.grade!=undefined)
                    return !validator.isEmpty(val.grade.toString());
                else
                    return false;
            });
        },
        isGradeValid: function(values){
            return values.every(function(val){
                if(val.grade=='A' || val.grade=='B' || val.grade=='C' || val.grade=='U' || val.grade=='N'){
                    return true;
                }
                else{
                    return false;
                }
            });
        }
    }
  }));

 route.get('/students',studentController.findStudents);

 route.get('/students/:id',studentController.findStudent);

 route.get('/students/:id/courses',studentController.findStudentCourses);

 route.post('/students',studentController.createStudent);

 route.post('/students/:id/courses',studentController.createStudentCourses);

 route.put('/students/:id',studentController.updateStudent);

 route.patch('/students/:studentId/courses/:courseId',studentController.updateStudentCourses);

 route.delete('/students/:id',studentController.removeStudent);

 route.delete('/students/:studentId/courses/:courseId',studentController.removeStudentCourse);

route.get('/professors',professorController.findProfessors);

route.get('/professors/:id/courses',professorController.findProfessorCourses);

route.get('/departments',departmentsController.findDepartments);

route.get('/courses',coursesController.findCourses);


module.exports = route;