const sql = require("./dbconfig.js");
const ProfessorObject = require("./Professor.js");
const CourseObject = require('./Course.js');
const studentController = require('./students.controller');


exports.findProfessors=(request,response)=>{
    queryStr = request.query;
    var queryParam = "";
    var sqlStatement = "" ;
    
    if(queryStr.id){
        queryParam = "where p_id="+queryStr.id;
        request.checkQuery('id','Invalid id').isInt().trim().escape();
    }
    if(queryStr.departmentId){
        if(queryParam){
            queryParam = queryParam.concat(" AND p.d_id=",queryStr.departmentId);
        }
        else{
            queryParam = "where p.d_id="+queryStr.departmentId;
        }
        request.checkQuery('departmentId','Invalid departmentId').isInt().trim().escape();
    }
    if(queryStr.firstName){
        if(queryParam){
            queryParam = queryParam.concat(" AND first_name='",queryStr.firstName,"'");
        }
        else{
            queryParam = "where first_name='"+queryStr.firstName+"'";
        }
        request.checkQuery('firstName','Invalid firstName').isAlpha().trim().escape();
    }
    if(queryStr.lastName){
        if(queryParam){
            queryParam = queryParam.concat(" AND last_name='",queryStr.lastName,"'");
        }
        else{
            queryParam = "where last_name='"+queryStr.lastName+"'";
        }
        request.checkQuery('lastName','Invalid lastName').isAlpha().trim().escape();
    }
    if(queryStr.dateOfBirth){
        if(queryParam){
            queryParam = queryParam.concat(" AND date_of_birth='",queryStr.dateOfBirth,"'");
        }
        else{
            queryParam = "where date_of_birth='"+queryStr.dateOfBirth+"'";
        }
        request.checkQuery('dateOfBirth','Invalid dateOfBirth').isValidDate();
    }
    if(queryStr.phoneNumber){
        if(queryParam){
            queryParam = queryParam.concat(" AND phone_number='",queryStr.phoneNumber,"'");
        }
        else{
            queryParam = "where phone_number='"+queryStr.phoneNumber+"'";
        }
        request.checkQuery('phoneNumber','Invalid phoneNumber').isNumeric().isLength({min:10,max:13}).trim().escape();
    }
    if(queryStr.address){
        if(queryParam){
            queryParam = queryParam.concat(" AND address='",queryStr.address,"'");
        }
        else{
            queryParam = "where address='"+queryStr.address+"'";
        }
    }
        sqlStatement = "select p_id,d.d_name as department_name,first_name,last_name,date_of_birth,phone_number,address from professors p join departments d using (d_id) "+queryParam;

        var errors = request.validationErrors();
        if(!errors){
            sql.query(sqlStatement,(err,res)=>{
                if(err){
                    var result = {
                        'error': err,
                        'links':studentController.getLinks()
                    }
                    response.status(500).json(result);
                }
                else if(res.length>0){
                    var professorObjects = [];
                    res.forEach(professor=>{
                        professorObjects.push(new ProfessorObject(professor));
                    });
                    var result = {
                        "professors": professorObjects,
                        "links": studentController.getLinks()
                    }
                    response.status(200).json(result);
                }
                else{
                    var result = {
                        "professors":[],
                        "links": studentController.getLinks()
                    }
                    response.status(200).json(result);
                }
            });
        }
        else{
            var result = {
                'error': errors,
                'links':studentController.getLinks()
            }
            response.status(400).json(result);
        }
};

exports.findProfessorCourses = (request,response) =>{
    request.checkParams('id','Invalid professor id').isInt().trim().escape();

    var errors = request.validationErrors();

    if(!errors){
        var professor_id = request.params.id;

        sql.query('select pc.c_id,c.c_name from professors_courses pc join courses c using (c_id) where p_id='+professor_id,(err,res)=>{
            if(err){
                var result = {
                    'error': err,
                    'links':studentController.getLinks()
                }
                response.status(500).json(result);
            }
            else if(res.length>0){
                var courseObjects = [];
                    res.forEach(course=>{
                        courseObjects.push(new CourseObject(course));
                    });
                    var result = {
                        "courses": courseObjects,
                        "links": studentController.getLinks()
                    }
                response.status(200).json(result);
            }
            else{
                var result = {
                    "courses":[],
                    "links": studentController.getLinks()
                }
                response.status(200).json(result);
            }
        });
    }
    else{
        var result = {
            'error': errors,
            'links':studentController.getLinks()
        }
        response.status(400).json(result);
    }
}